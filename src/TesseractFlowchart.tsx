import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GitCommitHorizontal, RotateCcw } from 'lucide-react';
import {
  buildSchlegelCubeWireframe,
  buildTesseractFlowGraph,
  computeBezierEdgeGeometry,
  FLOW_NODE_HEIGHT,
  FLOW_NODE_WIDTH,
  FLOW_VIEWBOX_HEIGHT,
  FLOW_VIEWBOX_WIDTH,
  type AnalysisChainColor,
  type FlowchartCell,
  type FlowchartRelation,
  type FlowEdge,
  type FlowFilter,
  type FlowNode,
  type FlowchartTesseractData,
  type TesseractColoringSpec,
  type TesseractColorMode,
} from './tesseractFlowGraph';

export type {
  AnalysisChainColor,
  FlowchartCell,
  FlowchartRelation,
  FlowchartTesseractData,
  FlowFilter,
  TesseractColoringSpec,
  TesseractColorMode,
} from './tesseractFlowGraph';

interface TesseractFlowchartProps {
  tesseractData: FlowchartTesseractData;
  selectedCellId: string;
  onSelectCell: (cellId: string) => void;
  flowFilter?: FlowFilter;
  onFlowFilterChange?: (filter: FlowFilter) => void;
  colorMode?: TesseractColorMode;
}

const NODE_COLORS: Record<FlowNode['role'], string> = {
  corporal: '#38bdf8',
  digital: '#a78bfa',
  estructural: '#34d399',
  mediador: '#818cf8',
  polo: '#f59e0b',
  aislado: '#64748b',
};

const CUBE_LABEL_COLORS: Record<string, string> = {
  real: '#38bdf8',
  virtual: '#f59e0b',
  materia: '#34d399',
  'vacío': '#a78bfa',
  individualidad: '#2dd4bf',
  totalidad: '#818cf8',
  'evolución': '#4ade80',
  'involución': '#fb7185',
};

export const ANALYSIS_CHAIN_STYLES: Record<
  AnalysisChainColor,
  {
    id: AnalysisChainColor;
    label: string;
    stroke: string;
    text: string;
    bg: string;
    border: string;
    markerId: string;
    schlegelMarkerId: string;
    arrowGlyph: '›' | '‹';
    parityLabel: string;
  }
> = {
  azul: {
    id: 'azul',
    label: 'Azul',
    stroke: '#60a5fa',
    text: '#93c5fd',
    bg: 'rgba(59, 130, 246, 0.14)',
    border: 'rgba(96, 165, 250, 0.45)',
    markerId: 'd3-flow-azul',
    schlegelMarkerId: 'schlegel-azul',
    arrowGlyph: '›',
    parityLabel: 'Paridad 0',
  },
  amarillo: {
    id: 'amarillo',
    label: 'Amarillo',
    stroke: '#facc15',
    text: '#fef08a',
    bg: 'rgba(234, 179, 8, 0.14)',
    border: 'rgba(250, 204, 21, 0.45)',
    markerId: 'd3-flow-amarillo',
    schlegelMarkerId: 'schlegel-amarillo',
    arrowGlyph: '‹',
    parityLabel: 'Paridad 0',
  },
  rojo: {
    id: 'rojo',
    label: 'Rojo',
    stroke: '#f87171',
    text: '#fca5a5',
    bg: 'rgba(239, 68, 68, 0.14)',
    border: 'rgba(248, 113, 113, 0.45)',
    markerId: 'd3-flow-rojo',
    schlegelMarkerId: 'schlegel-rojo',
    arrowGlyph: '‹',
    parityLabel: 'Paridad 1',
  },
  verde: {
    id: 'verde',
    label: 'Verde',
    stroke: '#4ade80',
    text: '#86efac',
    bg: 'rgba(34, 197, 94, 0.14)',
    border: 'rgba(74, 222, 128, 0.45)',
    markerId: 'd3-flow-verde',
    schlegelMarkerId: 'schlegel-verde',
    arrowGlyph: '›',
    parityLabel: 'Paridad 1',
  },
};

export function getCubeLabelColor(label: string): string {
  return CUBE_LABEL_COLORS[label] ?? '#94a3b8';
}

export function getAnalysisChainColor(
  chain?: AnalysisChainColor,
  fallbackDomain?: 'real' | 'virtual',
  isCleanMode = false
): string {
  if (isCleanMode) {
    return fallbackDomain === 'virtual' ? '#94a3b8' : '#f1f5f9';
  }
  if (chain && ANALYSIS_CHAIN_STYLES[chain]) {
    return ANALYSIS_CHAIN_STYLES[chain].stroke;
  }
  return fallbackDomain === 'virtual' ? '#f59e0b' : '#38bdf8';
}

export function getAnalysisChainTextColor(
  chain?: AnalysisChainColor,
  fallbackDomain?: 'real' | 'virtual',
  isCleanMode = false
): string {
  if (isCleanMode) {
    return fallbackDomain === 'virtual' ? '#cbd5e1' : '#f8fafc';
  }
  if (chain && ANALYSIS_CHAIN_STYLES[chain]) {
    return ANALYSIS_CHAIN_STYLES[chain].text;
  }
  return fallbackDomain === 'virtual' ? '#fcd34d' : '#7dd3fc';
}

export const CubeGlyph: React.FC<{
  dashed?: boolean;
  color?: string;
  size?: number;
  className?: string;
}> = ({ dashed = false, color = 'currentColor', size = 16, className = '' }) => {
  const dash = dashed ? '1.3 1.5' : undefined;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
    >
      {/* Back face */}
      <rect
        x="7"
        y="2.5"
        width="10.5"
        height="10.5"
        stroke={color}
        strokeWidth="1.2"
        strokeOpacity="0.65"
        strokeDasharray={dash}
      />
      {/* Connecting depth edges */}
      <line x1="2.5" y1="7" x2="7" y2="2.5" stroke={color} strokeWidth="1.2" strokeOpacity="0.7" strokeDasharray={dash} />
      <line x1="13" y1="7" x2="17.5" y2="2.5" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" strokeDasharray={dash} />
      <line x1="13" y1="17.5" x2="17.5" y2="13" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" strokeDasharray={dash} />
      <line x1="2.5" y1="17.5" x2="7" y2="13" stroke={color} strokeWidth="1.2" strokeOpacity="0.55" strokeDasharray={dash} />
      {/* Front face */}
      <rect
        x="2.5"
        y="7"
        width="10.5"
        height="10.5"
        stroke={color}
        strokeWidth="1.45"
        strokeDasharray={dash}
      />
    </svg>
  );
};

function getCellExtChain(
  cell: FlowchartCell,
  colorMode: TesseractColorMode
): AnalysisChainColor | undefined {
  if (colorMode === 'clean') return undefined;
  if (cell.exteriorChains?.[colorMode]) return cell.exteriorChains[colorMode];
  if (colorMode === 'mirrorReflected') {
    return cell.exteriorMirrorReflectedChain ?? cell.exteriorMirrorChain ?? cell.exteriorChain;
  }
  if (colorMode === 'parityMirror') {
    return cell.exteriorParityMirrorChain ?? cell.exteriorMirrorChain ?? cell.exteriorChain;
  }
  if (colorMode === 'mirror' || colorMode === 'mirrorFrameSwap') {
    return cell.exteriorMirrorChain ?? cell.exteriorChain;
  }
  return cell.exteriorChain;
}

function getCellIntChain(
  cell: FlowchartCell,
  colorMode: TesseractColorMode
): AnalysisChainColor | undefined {
  if (colorMode === 'clean') return undefined;
  if (cell.interiorChains?.[colorMode]) return cell.interiorChains[colorMode];
  if (colorMode === 'mirrorReflected') {
    return cell.interiorMirrorReflectedChain ?? cell.interiorMirrorChain ?? cell.interiorChain;
  }
  if (colorMode === 'parityMirror') {
    return cell.interiorParityMirrorChain ?? cell.interiorMirrorChain ?? cell.interiorChain;
  }
  if (colorMode === 'mirror' || colorMode === 'mirrorFrameSwap') {
    return cell.interiorMirrorChain ?? cell.interiorChain;
  }
  return cell.interiorChain;
}

function getRelationChain(
  rel: FlowchartRelation,
  colorMode: TesseractColorMode
): AnalysisChainColor | undefined {
  if (colorMode === 'clean') return undefined;
  if (rel.chains?.[colorMode]) return rel.chains[colorMode];
  if (colorMode === 'mirrorReflected') {
    return rel.mirrorReflectedChain ?? rel.mirrorChain ?? rel.analysisChain;
  }
  if (colorMode === 'parityMirror') {
    return rel.parityMirrorChain ?? rel.mirrorChain ?? rel.analysisChain;
  }
  if (colorMode === 'mirror' || colorMode === 'mirrorFrameSwap') {
    return rel.mirrorChain ?? rel.analysisChain;
  }
  return rel.analysisChain;
}

export const TesseractMiniSchlegel: React.FC<{
  cell: FlowchartCell;
  colorMode?: TesseractColorMode;
}> = ({ cell, colorMode = 'clean' }) => {
  const geom = useMemo(() => buildSchlegelCubeWireframe(90, 58, 34, 15, 16, -9), []);
  const isClean = colorMode === 'clean';
  const extChain = getCellExtChain(cell, colorMode);
  const intChain = getCellIntChain(cell, colorMode);
  const extDomain: 'real' | 'virtual' =
    cell.exteriorLabel === 'real'
      ? 'real'
      : cell.exteriorLabel === 'virtual'
      ? 'virtual'
      : cell.exteriorLine === '_'
      ? 'real'
      : 'virtual';
  const intDomain: 'real' | 'virtual' =
    cell.interiorLabel === 'real'
      ? 'real'
      : cell.interiorLabel === 'virtual'
      ? 'virtual'
      : cell.interiorLine === '_'
      ? 'real'
      : 'virtual';
  const extColor = isClean
    ? getAnalysisChainColor(undefined, extDomain, true)
    : extChain
    ? getAnalysisChainColor(extChain)
    : getCubeLabelColor(cell.exteriorLabel);
  const extTextColor = isClean
    ? getAnalysisChainTextColor(undefined, extDomain, true)
    : extChain
    ? getAnalysisChainTextColor(extChain)
    : extColor;
  const intColor = isClean
    ? getAnalysisChainColor(undefined, intDomain, true)
    : intChain
    ? getAnalysisChainColor(intChain)
    : getCubeLabelColor(cell.interiorLabel);
  const intTextColor = isClean
    ? getAnalysisChainTextColor(undefined, intDomain, true)
    : intChain
    ? getAnalysisChainTextColor(intChain)
    : intColor;

  return (
    <svg
      viewBox="0 0 180 116"
      className="w-full h-28 select-none rounded-lg bg-slate-950/70 border border-slate-800/70"
      role="img"
      aria-label={`Teseracto ${cell.id}: cubo exterior ${cell.exteriorLabel} ${
        cell.exteriorLine === '_' ? 'continuo' : 'punteado'
      }${extChain ? ` (${extChain})` : ''}, cubo interior ${cell.interiorLabel} ${
        cell.interiorLine === '_' ? 'continuo' : 'punteado'
      }${intChain ? ` (${intChain})` : ''}`}
    >
      <text x="8" y="14" fill={extTextColor} fontSize="8.5" fontFamily="monospace">
        ext: {cell.exteriorLabel} ({cell.exteriorLine === '_' ? 'continuas' : 'punteadas'})
      </text>
      <text x="172" y="108" textAnchor="end" fill={intTextColor} fontSize="8.5" fontFamily="monospace">
        int: {cell.interiorLabel} ({cell.interiorLine === '_' ? 'continuas' : 'punteadas'})
      </text>
      {geom.strutEdges.map((s, idx) => (
        <line
          key={`strut-${idx}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="#64748b"
          strokeWidth="0.9"
          strokeOpacity="0.4"
        />
      ))}
      {geom.exteriorEdges.map((e, idx) => (
        <line
          key={`ext-${idx}`}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={extColor}
          strokeWidth={e.isFront ? 1.9 : 1.2}
          strokeOpacity={e.isFront ? 0.98 : 0.55}
          strokeLinecap="round"
          strokeDasharray={cell.exteriorLine === '...' ? '0.8 4.4' : undefined}
        />
      ))}
      {geom.interiorEdges.map((e, idx) => (
        <line
          key={`int-${idx}`}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={intColor}
          strokeWidth={e.isFront ? 2.0 : 1.3}
          strokeOpacity={e.isFront ? 0.98 : 0.65}
          strokeLinecap="round"
          strokeDasharray={cell.interiorLine === '...' ? '0.8 4.2' : undefined}
        />
      ))}
    </svg>
  );
};

export const TesseractFlowchart: React.FC<TesseractFlowchartProps> = ({
  tesseractData,
  selectedCellId,
  onSelectCell,
  flowFilter: controlledFlowFilter,
  onFlowFilterChange,
  colorMode = 'clean',
}) => {
  const [internalFlowFilter, setInternalFlowFilter] = useState<FlowFilter>('all');
  const rawFlowFilter = controlledFlowFilter ?? internalFlowFilter;
  const setFlowFilter = onFlowFilterChange ?? setInternalFlowFilter;
  const isCleanMode = colorMode === 'clean';
  const isChainFilterRaw =
    rawFlowFilter === 'azul' ||
    rawFlowFilter === 'amarillo' ||
    rawFlowFilter === 'rojo' ||
    rawFlowFilter === 'verde';
  const flowFilter: FlowFilter = isCleanMode && isChainFilterRaw ? 'all' : rawFlowFilter;
  const [focusedConcept, setFocusedConcept] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<FlowEdge | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const customPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const [layoutVersion, setLayoutVersion] = useState(0);

  const isChainFilter =
    flowFilter === 'azul' ||
    flowFilter === 'amarillo' ||
    flowFilter === 'rojo' ||
    flowFilter === 'verde';

  const getRelChain = (rel: FlowchartRelation): AnalysisChainColor | undefined =>
    getRelationChain(rel, colorMode);

  const activeCells = useMemo(
    () =>
      isCleanMode && tesseractData.cleanForm?.cells?.length
        ? tesseractData.cleanForm.cells
        : tesseractData.cells,
    [isCleanMode, tesseractData.cleanForm, tesseractData.cells]
  );

  const selectedCell = useMemo(
    () => activeCells.find((c) => c.id === selectedCellId) ?? activeCells[0],
    [activeCells, selectedCellId]
  );

  const baseGraph = useMemo(
    () => buildTesseractFlowGraph(tesseractData, flowFilter, colorMode),
    [tesseractData, flowFilter, colorMode]
  );

  // Build local concept set of the selected cell
  const selectedCellConcepts = useMemo(() => {
    const set = new Set<string>();
    if (!selectedCell) return set;
    for (const rel of selectedCell.relations) {
      set.add(rel.left);
      set.add(rel.right);
    }
    return set;
  }, [selectedCell]);

  // Keep latest callbacks in refs so D3 handlers don't force full SVG teardown on state change
  const onSelectCellRef = useRef(onSelectCell);
  onSelectCellRef.current = onSelectCell;

  // Reset custom dragged node positions if the underlying tesseractData concepts change
  useEffect(() => {
    const validIds = new Set(baseGraph.nodes.map((n) => n.id));
    for (const key of customPositionsRef.current.keys()) {
      if (!validIds.has(key)) customPositionsRef.current.delete(key);
    }
  }, [baseGraph.nodes]);

  // Render and update the D3 flowchart SVG dynamically whenever data, filter, focus, or selection changes
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);

    // Clone nodes with persisted user-dragged coordinates if present
    const nodes: FlowNode[] = baseGraph.nodes.map((n) => {
      const saved = customPositionsRef.current.get(n.id);
      return saved ? { ...n, x: saved.x, y: saved.y } : { ...n };
    });
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const edges: FlowEdge[] = baseGraph.edges.map((e) => ({ ...e }));

    // Ensure structural SVG layers once
    if (svg.select('defs').empty()) {
      const defs = svg.append('defs');
      const addMarker = (id: string, color: string) => {
        defs
          .append('marker')
          .attr('id', id)
          .attr('viewBox', '0 0 10 10')
          .attr('refX', 8)
          .attr('refY', 5)
          .attr('markerWidth', 6)
          .attr('markerHeight', 6)
          .attr('orient', 'auto-start-reverse')
          .append('path')
          .attr('d', 'M 0 1 L 10 5 L 0 9 z')
          .attr('fill', color);
      };
      addMarker('d3-flow-real', '#38bdf8');
      addMarker('d3-flow-virtual', '#f59e0b');
      addMarker('d3-flow-clean-real', '#f1f5f9');
      addMarker('d3-flow-clean-virtual', '#94a3b8');
      (Object.values(ANALYSIS_CHAIN_STYLES)).forEach((st) => {
        addMarker(st.markerId, st.stroke);
      });
    }

    let viewport = svg.select<SVGGElement>('g.d3-viewport');
    if (viewport.empty()) {
      viewport = svg.append('g').attr('class', 'd3-viewport');
      viewport.append('g').attr('class', 'd3-tier-headers');
      viewport.append('g').attr('class', 'd3-links-layer');
      viewport.append('g').attr('class', 'd3-badges-layer');
      viewport.append('g').attr('class', 'd3-nodes-layer');
    }

    // Configure D3 zoom/pan on SVG background
    if (!zoomBehaviorRef.current) {
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.75, 2.2])
        .on('zoom', (event) => {
          viewport.attr('transform', event.transform.toString());
        });
      zoomBehaviorRef.current = zoom;
      svg.call(zoom).on('dblclick.zoom', null);
    }

    const isEdgeHighlighted = (e: FlowEdge) => {
      if (focusedConcept) {
        return e.source === focusedConcept || e.target === focusedConcept;
      }
      return e.cellId === selectedCell?.id;
    };

    const isNodeHighlighted = (n: FlowNode) => {
      if (focusedConcept) {
        if (n.id === focusedConcept) return true;
        return edges.some(
          (e) =>
            (e.source === focusedConcept && e.target === n.id) ||
            (e.target === focusedConcept && e.source === n.id)
        );
      }
      return selectedCellConcepts.has(n.id);
    };

    const isTwoCol = nodes.every((n) => n.tier !== 1);
    const tierHeaders = Array.from(
      d3.rollup(
        nodes,
        (group) => d3.mean(group, (d) => d.x) ?? FLOW_VIEWBOX_WIDTH / 2,
        (d) => d.tier
      ),
      ([tier, meanX]) => ({
        tier,
        x: meanX,
        label: isCleanMode
          ? tier === 0
            ? 'POLO A'
            : tier === 2
            ? 'POLO B'
            : 'EJES DEL SISTEMA'
          : isTwoCol
          ? tier === 0
            ? 'POLO RECÍPROCO A'
            : 'POLO RECÍPROCO B'
          : tier === 0
          ? 'ORIGEN / MEDIADORES'
          : tier === 2
          ? 'POLOS'
          : 'MEDIADORES',
      })
    );

    viewport
      .select<SVGGElement>('g.d3-tier-headers')
      .selectAll<SVGTextElement, (typeof tierHeaders)[number]>('text')
      .data(tierHeaders, (d) => String(d.tier))
      .join('text')
      .attr('x', (d) => d.x)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '10')
      .attr('font-family', 'monospace')
      .text((d) => d.label);

    const linksLayer = viewport.select<SVGGElement>('g.d3-links-layer');
    const badgesLayer = viewport.select<SVGGElement>('g.d3-badges-layer');
    const nodesLayer = viewport.select<SVGGElement>('g.d3-nodes-layer');

    const linkGroups = linksLayer
      .selectAll<SVGGElement, FlowEdge>('g.d3-link-item')
      .data(edges, (d) => d.id)
      .join((enter) => {
        const g = enter.append('g').attr('class', 'd3-link-item cursor-pointer');
        g.append('path').attr('class', 'd3-link-visible').attr('fill', 'none');
        g.append('path')
          .attr('class', 'd3-link-hit')
          .attr('fill', 'none')
          .attr('stroke', 'transparent')
          .attr('stroke-width', 14);
        return g;
      });

    const badgeGroups = badgesLayer
      .selectAll<SVGGElement, FlowEdge>('g.d3-link-badge')
      .data(edges, (d) => d.id)
      .join((enter) => {
        const g = enter.append('g').attr('class', 'd3-link-badge cursor-pointer');
        g.append('rect')
          .attr('width', 24)
          .attr('height', 14)
          .attr('x', -12)
          .attr('y', -7)
          .attr('rx', 4);
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-size', '8.5')
          .attr('font-family', 'monospace')
          .attr('font-weight', '700');
        return g;
      });

    const updatePositions = () => {
      linkGroups.each(function (d) {
        const src = nodeById.get(d.source);
        const tgt = nodeById.get(d.target);
        if (!src || !tgt) return;

        const geom = computeBezierEdgeGeometry(
          src,
          tgt,
          d.curveOffset,
          FLOW_NODE_WIDTH,
          FLOW_NODE_HEIGHT
        );
        const highlighted = isEdgeHighlighted(d);
        const chain = getRelationChain(d.rel, colorMode);
        const color = getAnalysisChainColor(chain, d.rel.domain, isCleanMode);
        const marker = isCleanMode
          ? d.rel.domain === 'real'
            ? 'url(#d3-flow-clean-real)'
            : 'url(#d3-flow-clean-virtual)'
          : chain
          ? `url(#${ANALYSIS_CHAIN_STYLES[chain].markerId})`
          : d.rel.domain === 'real'
          ? 'url(#d3-flow-real)'
          : 'url(#d3-flow-virtual)';
        const strokeOpacity = highlighted ? 0.98 : isChainFilter ? 0.72 : 0.42;

        const sel = d3.select(this);
        sel
          .select<SVGPathElement>('path.d3-link-visible')
          .attr('d', geom.path)
          .attr('stroke', color)
          .attr('stroke-width', highlighted ? 2.8 : isChainFilter ? 2.0 : 1.45)
          .attr('stroke-opacity', strokeOpacity)
          .attr('stroke-dasharray', d.rel.line === '...' ? '5 4' : null)
          .attr('marker-end', marker);

        sel.select<SVGPathElement>('path.d3-link-hit').attr('d', geom.path);
      });

      badgeGroups.each(function (d) {
        const src = nodeById.get(d.source);
        const tgt = nodeById.get(d.target);
        if (!src || !tgt) return;

        const geom = computeBezierEdgeGeometry(
          src,
          tgt,
          d.curveOffset,
          FLOW_NODE_WIDTH,
          FLOW_NODE_HEIGHT
        );
        const highlighted = isEdgeHighlighted(d);
        const chain = getRelationChain(d.rel, colorMode);
        const color = getAnalysisChainColor(chain, d.rel.domain, isCleanMode);
        const badgeOpacity = highlighted ? '1' : isChainFilter ? '0.88' : '0';

        const badge = d3.select(this);
        badge
          .attr('transform', `translate(${geom.labelX.toFixed(1)}, ${geom.labelY.toFixed(1)})`)
          .style('opacity', badgeOpacity);
        badge
          .select('rect')
          .attr('fill', '#020617')
          .attr('stroke', color)
          .attr('stroke-width', highlighted ? 1.2 : 0.9);
        badge.select('text').attr('fill', color).text(d.cellId);
      });
    };

    const bindEdgeEvents = (sel: d3.Selection<SVGGElement, FlowEdge, SVGGElement, unknown>) => {
      sel
        .on('mouseenter', (_event, d) => setHoveredEdge(d))
        .on('mouseleave', () => setHoveredEdge(null))
        .on('click', (event, d) => {
          event.stopPropagation();
          onSelectCellRef.current(d.cellId);
        });
    };

    bindEdgeEvents(linkGroups);
    bindEdgeEvents(badgeGroups);

    const nodeGroups = nodesLayer
      .selectAll<SVGGElement, FlowNode>('g.d3-node-item')
      .data(nodes, (d) => d.id)
      .join((enter) => {
        const g = enter.append('g').attr('class', 'd3-node-item cursor-grab active:cursor-grabbing');
        g.append('rect')
          .attr('x', -FLOW_NODE_WIDTH / 2)
          .attr('y', -FLOW_NODE_HEIGHT / 2)
          .attr('width', FLOW_NODE_WIDTH)
          .attr('height', FLOW_NODE_HEIGHT)
          .attr('rx', 9);
        g.append('text')
          .attr('class', 'd3-node-label')
          .attr('y', 1)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-family', 'monospace')
          .attr('font-size', '12.5');
        g.append('text')
          .attr('class', 'd3-node-degree')
          .attr('y', FLOW_NODE_HEIGHT / 2 + 12)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'monospace')
          .attr('font-size', '9')
          .attr('fill', '#64748b');
        return g;
      });

    nodeGroups.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

    nodeGroups.each(function (d) {
      const active = isNodeHighlighted(d);
      const isFocused = focusedConcept === d.id;
      const stroke = isFocused ? '#f8fafc' : NODE_COLORS[d.role] ?? '#64748b';
      const g = d3.select(this);

      g.select('rect')
        .attr('fill', active ? '#0f172a' : '#020617')
        .attr('stroke', stroke)
        .attr('stroke-width', isFocused ? 2.5 : active ? 2 : 1)
        .attr('stroke-opacity', active ? 1 : 0.48);

      g.select('text.d3-node-label')
        .attr('fill', active ? '#f8fafc' : '#94a3b8')
        .attr('font-weight', active ? '700' : '500')
        .text(d.id);

      const degText =
        d.outDegree > 0 && d.inDegree > 0
          ? `in:${d.inDegree} · out:${d.outDegree}`
          : d.outDegree === 0 && d.inDegree === 0
          ? 'polaridad fija'
          : d.outDegree > 0
          ? `salidas: ${d.outDegree}`
          : `entradas: ${d.inDegree}`;
      g.select('text.d3-node-degree').text(degText);
    });

    // Interactive D3 drag behavior on nodes so users can rearrange the graph dynamically
    let draggedMoved = false;
    const dragBehavior = d3
      .drag<SVGGElement, FlowNode>()
      .on('start', function () {
        draggedMoved = false;
        d3.select(this).raise();
      })
      .on('drag', function (event, d) {
        draggedMoved = true;
        d.x = Math.max(FLOW_NODE_WIDTH / 2 + 8, Math.min(FLOW_VIEWBOX_WIDTH - FLOW_NODE_WIDTH / 2 - 8, event.x));
        d.y = Math.max(FLOW_NODE_HEIGHT / 2 + 30, Math.min(FLOW_VIEWBOX_HEIGHT - FLOW_NODE_HEIGHT / 2 - 18, event.y));
        customPositionsRef.current.set(d.id, { x: d.x, y: d.y });
        d3.select(this).attr('transform', `translate(${d.x}, ${d.y})`);
        updatePositions();
      })
      .on('end', (_event, d) => {
        if (!draggedMoved) {
          setFocusedConcept((prev) => (prev === d.id ? null : d.id));
        }
      });

    nodeGroups.call(dragBehavior);
    updatePositions();
  }, [baseGraph, selectedCell, selectedCellConcepts, focusedConcept, isChainFilter, colorMode, layoutVersion]);

  const handleResetLayout = () => {
    customPositionsRef.current.clear();
    setFocusedConcept(null);
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(250)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
    setLayoutVersion((v) => v + 1);
  };

  if (!selectedCell) return null;

  const activeColoring: TesseractColoringSpec | undefined = isCleanMode
    ? undefined
    : tesseractData.colorings?.find((c) => c.id === colorMode);
  const isFrameMirrorMode = activeColoring
    ? activeColoring.family === 'mirror'
    : !isCleanMode && colorMode.startsWith('mirror');

  const chainOrder: readonly AnalysisChainColor[] = activeColoring
    ? activeColoring.chains.map((c) => c.id)
    : ['azul', 'amarillo', 'rojo', 'verde'];

  const chainMetaById = new Map(
    (activeColoring?.chains ?? []).map((c) => [c.id, c])
  );

  const getChainArrowGlyph = (chainId: AnalysisChainColor): '›' | '‹' => {
    const spec = chainMetaById.get(chainId);
    if (spec?.arrow) return spec.arrow === '>' ? '›' : '‹';
    return ANALYSIS_CHAIN_STYLES[chainId].arrowGlyph;
  };

  const getChainParityLabel = (chainId: AnalysisChainColor): string => {
    const spec = chainMetaById.get(chainId);
    if (spec?.parity !== undefined) return `Paridad ${spec.parity}`;
    return ANALYSIS_CHAIN_STYLES[chainId].parityLabel;
  };

  return (
    <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-5">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <GitCommitHorizontal className="w-4 h-4 text-sky-400" />
            {isCleanMode
              ? 'Diagrama de Flujo D3: Forma Definitiva (28 nov 2026) · Real/Virtual & Materia/Vacío + Bucle'
              : activeColoring
              ? `Diagrama de Flujo D3: ${activeColoring.title} · Transiciones Real (›) / Virtual (‹)`
              : 'Diagrama de Flujo D3: Clausura Especular y Transiciones Real (›) / Virtual (‹)'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Renderizado dinámicamente con <code className="text-sky-300">d3</code> desde{' '}
            <code className="text-sky-300">tesseractData</code> ({baseGraph.nodes.length} conceptos,{' '}
            {baseGraph.edges.length} transiciones activas).{' '}
            {isCleanMode
              ? tesseractData.cleanForm?.summary ??
                'Estructura pura en blanco y negro sin capas cromáticas superpuestas.'
              : activeColoring?.summary ??
                'Clausura completa del espejeo interno sobre las 8 proyecciones del teseracto.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex shrink-0 rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
            {(
              [
                { id: 'all', label: 'Todos (16)' },
                { id: 'real', label: isCleanMode ? 'Real / Materia (8)' : 'Real › (8)' },
                { id: 'virtual', label: isCleanMode ? 'Virtual / Vacío (8)' : 'Virtual ‹ (8)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFlowFilter(opt.id)}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
                  flowFilter === opt.id
                    ? isCleanMode
                      ? 'bg-slate-200/15 text-slate-100'
                      : 'bg-sky-500/20 text-sky-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {!isCleanMode && (
            <div className="inline-flex flex-wrap shrink-0 rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
              {chainOrder.map((chainId) => {
                const st = ANALYSIS_CHAIN_STYLES[chainId];
                const active = flowFilter === chainId;
                const arrowGlyph = getChainArrowGlyph(chainId);
                const parityLabel = getChainParityLabel(chainId);
                return (
                  <button
                    key={chainId}
                    onClick={() => setFlowFilter(active ? 'all' : chainId)}
                    style={
                      active
                        ? { backgroundColor: st.bg, color: st.text, borderColor: st.border }
                        : undefined
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap border transition cursor-pointer ${
                      active ? '' : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                    title={
                      isFrameMirrorMode
                        ? `${st.label} (${activeColoring?.assetTag ?? 'marcos'} · 2 › / 2 ‹)`
                        : `${st.label} (${parityLabel}, flecha ${arrowGlyph})`
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: st.stroke }}
                    />
                    {isFrameMirrorMode
                      ? `${st.label} (4)`
                      : `${st.label} ${arrowGlyph} (4)`}
                  </button>
                );
              })}
            </div>
          )}
          <button
            onClick={handleResetLayout}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 whitespace-nowrap cursor-pointer"
            title="Restablecer posiciones y zoom del diagrama D3"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reordenar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Dynamic D3 Concept Flow Graph */}
        <div className="xl:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <span>
              Red D3 ({baseGraph.nodes.length} nodos · {baseGraph.edges.length} aristas)
            </span>
            <div className="flex items-center gap-2">
              {isChainFilter && (
                <span
                  className="px-2 py-0.5 rounded border text-[10px]"
                  style={{
                    color: ANALYSIS_CHAIN_STYLES[flowFilter as AnalysisChainColor].text,
                    backgroundColor: ANALYSIS_CHAIN_STYLES[flowFilter as AnalysisChainColor].bg,
                    borderColor: ANALYSIS_CHAIN_STYLES[flowFilter as AnalysisChainColor].border,
                  }}
                >
                  {isFrameMirrorMode
                    ? `${activeColoring?.assetTag ?? 'Marcos'} · ${
                        ANALYSIS_CHAIN_STYLES[flowFilter as AnalysisChainColor].label
                      } · 2 › / 2 ‹`
                    : `${activeColoring?.assetTag ?? 'Paridad'} · ${
                        ANALYSIS_CHAIN_STYLES[flowFilter as AnalysisChainColor].label
                      } · ${getChainParityLabel(flowFilter as AnalysisChainColor)}`}
                </span>
              )}
              {focusedConcept && (
                <button
                  onClick={() => setFocusedConcept(null)}
                  className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-200 cursor-pointer"
                >
                  Concepto: {focusedConcept} ×
                </button>
              )}
              <span>Celda enfocada: {selectedCell.id}</span>
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${FLOW_VIEWBOX_WIDTH} ${FLOW_VIEWBOX_HEIGHT}`}
            className="w-full h-auto select-none rounded-lg bg-slate-950/60"
            role="img"
            aria-label="Diagrama de flujo D3 del teseracto único"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              {isCleanMode ? (
                <>
                  <span className="inline-flex items-center gap-1.5 text-slate-100">
                    <span className="w-4 h-0.5 inline-block bg-slate-100" />
                    continuo (_) = real (T1,T4,T6,T7) / materia (T2,T3,T5,T8)
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-300">
                    <span className="w-4 border-t-2 border-dashed border-slate-400 inline-block" />
                    punteado (...) = virtual / vacío · bucle ↻ sup / ↺ inf
                  </span>
                </>
              ) : (
                <>
                  {chainOrder.map((chainId) => {
                    const st = ANALYSIS_CHAIN_STYLES[chainId];
                    const arrowGlyph = getChainArrowGlyph(chainId);
                    return (
                      <span key={chainId} className="inline-flex items-center gap-1.5">
                        <span className="w-3.5 h-0.5 inline-block" style={{ backgroundColor: st.stroke }} />
                        <span style={{ color: st.text }}>
                          {isFrameMirrorMode ? chainId : `${chainId} (${arrowGlyph})`}
                        </span>
                      </span>
                    );
                  })}
                  <span className="text-slate-400">· _ / ...</span>
                </>
              )}
            </div>
            {hoveredEdge ? (
              <span className="text-slate-200 truncate">
                {hoveredEdge.cellId} ({hoveredEdge.rel.cubeLabel}): {hoveredEdge.rel.notation} [
                {getRelChain(hoveredEdge.rel) ??
                  `${hoveredEdge.rel.domain}${
                    hoveredEdge.rel.strokeStyle === 'bucle'
                      ? ` · bucle ${hoveredEdge.rel.loopSense ?? ''}`
                      : ' · recta'
                  }`}
                ]
              </span>
            ) : (
              <span className="text-slate-500 whitespace-nowrap">
                Clic nodo/arista · Arrastrar · Zoom
              </span>
            )}
          </div>
        </div>

        {/* Right: Selected Cell Schlegel Wireframe & Cube Transitions */}
        <div className="xl:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-mono text-slate-400">
                {selectedCell.half}
                {selectedCell.domainLegend ? ` · ${selectedCell.domainLegend}` : ''}
                {' · '}espejo inv. ↔ {selectedCell.neighbors.vertical}
                {selectedCell.polarityLeft && selectedCell.polarityRight
                  ? ` · ${selectedCell.polarityLeft} | ${selectedCell.polarityRight}`
                  : ''}
              </div>
              <h4 className="text-sm font-semibold font-mono text-white">
                {selectedCell.id} · {selectedCell.axisPair}
              </h4>
            </div>
            {(() => {
              const extChain = getCellExtChain(selectedCell, colorMode);
              const intChain = getCellIntChain(selectedCell, colorMode);
              const extDomain: 'real' | 'virtual' =
                selectedCell.exteriorLabel === 'real'
                  ? 'real'
                  : selectedCell.exteriorLabel === 'virtual'
                  ? 'virtual'
                  : selectedCell.exteriorLine === '_'
                  ? 'real'
                  : 'virtual';
              const intDomain: 'real' | 'virtual' =
                selectedCell.interiorLabel === 'real'
                  ? 'real'
                  : selectedCell.interiorLabel === 'virtual'
                  ? 'virtual'
                  : selectedCell.interiorLine === '_'
                  ? 'real'
                  : 'virtual';
              const extBadgeText = isCleanMode
                ? getAnalysisChainTextColor(undefined, extDomain, true)
                : extChain
                ? getAnalysisChainTextColor(extChain)
                : getCubeLabelColor(selectedCell.exteriorLabel);
              const extBadgeBorder = isCleanMode
                ? getAnalysisChainColor(undefined, extDomain, true)
                : extChain
                ? getAnalysisChainColor(extChain)
                : getCubeLabelColor(selectedCell.exteriorLabel);
              const intBadgeText = isCleanMode
                ? getAnalysisChainTextColor(undefined, intDomain, true)
                : intChain
                ? getAnalysisChainTextColor(intChain)
                : getCubeLabelColor(selectedCell.interiorLabel);
              const intBadgeBorder = isCleanMode
                ? getAnalysisChainColor(undefined, intDomain, true)
                : intChain
                ? getAnalysisChainColor(intChain)
                : getCubeLabelColor(selectedCell.interiorLabel);
              return (
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span
                    className="px-2 py-0.5 rounded border bg-slate-900/90"
                    style={{
                      color: extBadgeText,
                      borderColor: `${extBadgeBorder}66`,
                    }}
                  >
                    ext: {selectedCell.exteriorLabel} ({selectedCell.exteriorLine === '_' ? 'continuas' : 'punteadas'})
                  </span>
                  <span
                    className="px-2 py-0.5 rounded border bg-slate-900/90"
                    style={{
                      color: intBadgeText,
                      borderColor: `${intBadgeBorder}66`,
                    }}
                  >
                    int: {selectedCell.interiorLabel} ({selectedCell.interiorLine === '_' ? 'continuas' : 'punteadas'})
                  </span>
                </div>
              );
            })()}
          </div>

          {(() => {
            const schlegel = buildSchlegelCubeWireframe(210, 160, 56, 25, 24, -14);
            const extChain = getCellExtChain(selectedCell, colorMode);
            const intChain = getCellIntChain(selectedCell, colorMode);
            const extDomain: 'real' | 'virtual' =
              selectedCell.exteriorLabel === 'real'
                ? 'real'
                : selectedCell.exteriorLabel === 'virtual'
                ? 'virtual'
                : selectedCell.exteriorLine === '_'
                ? 'real'
                : 'virtual';
            const intDomain: 'real' | 'virtual' =
              selectedCell.interiorLabel === 'real'
                ? 'real'
                : selectedCell.interiorLabel === 'virtual'
                ? 'virtual'
                : selectedCell.interiorLine === '_'
                ? 'real'
                : 'virtual';
            const extColor = isCleanMode
              ? getAnalysisChainColor(undefined, extDomain, true)
              : extChain
              ? getAnalysisChainColor(extChain)
              : getCubeLabelColor(selectedCell.exteriorLabel);
            const extTextColor = isCleanMode
              ? getAnalysisChainTextColor(undefined, extDomain, true)
              : extChain
              ? getAnalysisChainTextColor(extChain)
              : extColor;
            const intColor = isCleanMode
              ? getAnalysisChainColor(undefined, intDomain, true)
              : intChain
              ? getAnalysisChainColor(intChain)
              : getCubeLabelColor(selectedCell.interiorLabel);
            const intTextColor = isCleanMode
              ? getAnalysisChainTextColor(undefined, intDomain, true)
              : intChain
              ? getAnalysisChainTextColor(intChain)
              : intColor;
            const extRel = selectedCell.relations.find((r) => r.cube === 'exterior') ?? selectedCell.relations[0];
            const intRel = selectedCell.relations.find((r) => r.cube === 'interior') ?? selectedCell.relations[1];

            const renderTransitionRow = (
              rel: typeof extRel,
              y: number,
              label: string,
              polarityPlacement: 'above' | 'below'
            ) => {
              if (!rel) return null;
              const chain = getRelChain(rel);
              const stroke = getAnalysisChainColor(chain, rel.domain, isCleanMode);
              const textColor = getAnalysisChainTextColor(chain, rel.domain, isCleanMode);
              const markerEnd = isCleanMode
                ? rel.domain === 'real'
                  ? 'url(#schlegel-clean-real)'
                  : 'url(#schlegel-clean-virtual)'
                : chain
                ? `url(#${ANALYSIS_CHAIN_STYLES[chain].schlegelMarkerId})`
                : rel.domain === 'real'
                ? 'url(#schlegel-real)'
                : 'url(#schlegel-virtual)';
              const isRight = rel.arrow === '>';
              const showEndpointPolarities =
                isCleanMode && Boolean(rel.leftPolarity) && Boolean(rel.rightPolarity);
              const headerY =
                showEndpointPolarities && polarityPlacement === 'above' ? y - 35 : y - 22;
              const polarityY = polarityPlacement === 'above' ? y - 20 : y + 27;
              return (
                <g key={`${rel.cube}-${rel.notation}`}>
                  <text
                    x="210"
                    y={headerY}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {label}
                  </text>
                  {showEndpointPolarities && (
                    <>
                      <text
                        x="70"
                        y={polarityY}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        {rel.leftPolarity}
                      </text>
                      <text
                        x="350"
                        y={polarityY}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        {rel.rightPolarity}
                      </text>
                    </>
                  )}
                  <rect
                    x="12"
                    y={y - 14}
                    width="116"
                    height="28"
                    rx="6"
                    fill="#0f172a"
                    stroke={stroke}
                    strokeWidth="1.2"
                  />
                  <text
                    x="70"
                    y={y + 3.5}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10.5"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {rel.left}
                  </text>
                  <line
                    x1={isRight ? 132 : 288}
                    y1={y}
                    x2={isRight ? 282 : 138}
                    y2={y}
                    stroke={stroke}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray={rel.line === '...' ? '3 5' : undefined}
                    markerEnd={markerEnd}
                  />
                  {/* Inline mini 3D cube glyph (solid vs dashed) mirroring IMG_20261123_015713 diagram */}
                  <g transform={`translate(201, ${y - 9})`}>
                    <rect
                      x="-2"
                      y="-2"
                      width="22"
                      height="22"
                      rx="4"
                      fill="#020617"
                    />
                    <rect
                      x="5"
                      y="1"
                      width="11"
                      height="11"
                      fill="none"
                      stroke={stroke}
                      strokeWidth="1.15"
                      strokeOpacity="0.65"
                      strokeDasharray={rel.line === '...' ? '1.6 1.8' : undefined}
                    />
                    <line
                      x1="1"
                      y1="5"
                      x2="5"
                      y2="1"
                      stroke={stroke}
                      strokeWidth="1.1"
                      strokeOpacity="0.7"
                      strokeDasharray={rel.line === '...' ? '1.6 1.8' : undefined}
                    />
                    <line
                      x1="12"
                      y1="5"
                      x2="16"
                      y2="1"
                      stroke={stroke}
                      strokeWidth="1.1"
                      strokeOpacity="0.85"
                      strokeDasharray={rel.line === '...' ? '1.6 1.8' : undefined}
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="16"
                      y2="12"
                      stroke={stroke}
                      strokeWidth="1.1"
                      strokeOpacity="0.85"
                      strokeDasharray={rel.line === '...' ? '1.6 1.8' : undefined}
                    />
                    <line
                      x1="1"
                      y1="16"
                      x2="5"
                      y2="12"
                      stroke={stroke}
                      strokeWidth="1.1"
                      strokeOpacity="0.55"
                      strokeDasharray={rel.line === '...' ? '1.6 1.8' : undefined}
                    />
                    <rect
                      x="1"
                      y="5"
                      width="11"
                      height="11"
                      fill="#020617"
                      fillOpacity="0.85"
                      stroke={stroke}
                      strokeWidth="1.4"
                      strokeDasharray={rel.line === '...' ? '1.6 1.8' : undefined}
                    />
                  </g>
                  <text
                    x="210"
                    y={y + 20}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {rel.strokeStyle === 'bucle'
                      ? `${rel.loopSense === 'antihorario' ? '↺' : '↻'} `
                      : `${rel.arrow === '>' ? '→' : '←'} `}
                    {isCleanMode ? rel.cubeLabel : rel.domain}
                    {rel.strokeStyle === 'bucle' ? ` · bucle ${rel.loopSense ?? ''}` : ''}
                    {chain ? ` · ${chain}` : ''}
                  </text>
                  <rect
                    x="292"
                    y={y - 14}
                    width="116"
                    height="28"
                    rx="6"
                    fill="#0f172a"
                    stroke={stroke}
                    strokeWidth="1.2"
                  />
                  <text
                    x="350"
                    y={y + 3.5}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10.5"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {rel.right}
                  </text>
                </g>
              );
            };

            return (
              <svg
                viewBox="0 0 420 310"
                className="w-full h-auto select-none rounded-lg bg-slate-950/60"
                role="img"
                aria-label={`Proyección Schlegel del teseracto ${selectedCell.id}`}
              >
                <defs>
                  <marker
                    id="schlegel-real"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                  </marker>
                  <marker
                    id="schlegel-virtual"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                  </marker>
                  <marker
                    id="schlegel-clean-real"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#f1f5f9" />
                  </marker>
                  <marker
                    id="schlegel-clean-virtual"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                  </marker>
                  {Object.values(ANALYSIS_CHAIN_STYLES).map((st) => (
                    <marker
                      key={st.schlegelMarkerId}
                      id={st.schlegelMarkerId}
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill={st.stroke} />
                    </marker>
                  ))}
                </defs>

                {renderTransitionRow(
                  extRel,
                  50,
                  `cubo exterior · ${selectedCell.exteriorLabel} (${
                    selectedCell.exteriorLine === '_' ? 'continuas _' : 'punteadas ...'
                  })`,
                  'above'
                )}

                {/* 4D hypercube connecting struts */}
                <g>
                  {schlegel.strutEdges.map((s, idx) => (
                    <line
                      key={`strut-${idx}`}
                      x1={s.x1}
                      y1={s.y1}
                      x2={s.x2}
                      y2={s.y2}
                      stroke="#64748b"
                      strokeWidth="1"
                      strokeOpacity="0.38"
                    />
                  ))}
                </g>

                {/* Outer cube wireframe (cubo exterior) */}
                <g>
                  {schlegel.exteriorEdges.map((e, idx) => (
                    <line
                      key={`ext-${idx}`}
                      x1={e.x1}
                      y1={e.y1}
                      x2={e.x2}
                      y2={e.y2}
                      stroke={extColor}
                      strokeWidth={e.isFront ? 2.4 : 1.5}
                      strokeOpacity={e.isFront ? 0.98 : 0.52}
                      strokeLinecap="round"
                      strokeDasharray={selectedCell.exteriorLine === '...' ? '1 5.5' : undefined}
                    />
                  ))}
                </g>

                {/* Inner cube wireframe (cubo interior) */}
                <g>
                  {schlegel.interiorEdges.map((e, idx) => (
                    <line
                      key={`int-${idx}`}
                      x1={e.x1}
                      y1={e.y1}
                      x2={e.x2}
                      y2={e.y2}
                      stroke={intColor}
                      strokeWidth={e.isFront ? 2.5 : 1.6}
                      strokeOpacity={e.isFront ? 0.98 : 0.65}
                      strokeLinecap="round"
                      strokeDasharray={selectedCell.interiorLine === '...' ? '1 5.5' : undefined}
                    />
                  ))}
                </g>

                {/* Lateral callout annotations pointing cleanly to outer & inner cubes */}
                <text x="16" y="150" fill={extTextColor} fontSize="9.5" fontFamily="monospace">
                  cubo exterior
                </text>
                <text x="16" y="163" fill={extTextColor} fontSize="9" fontFamily="monospace" opacity="0.9">
                  {selectedCell.exteriorLabel} · {selectedCell.exteriorLine === '_' ? 'continuas' : 'punteadas'}
                </text>
                <line
                  x1="108"
                  y1="154"
                  x2="142"
                  y2="154"
                  stroke={extColor}
                  strokeWidth="1"
                  strokeOpacity="0.7"
                  strokeDasharray={selectedCell.exteriorLine === '...' ? '2 3' : undefined}
                />

                <text x="404" y="150" textAnchor="end" fill={intTextColor} fontSize="9.5" fontFamily="monospace">
                  cubo interior
                </text>
                <text x="404" y="163" textAnchor="end" fill={intTextColor} fontSize="9" fontFamily="monospace" opacity="0.9">
                  {selectedCell.interiorLabel} · {selectedCell.interiorLine === '_' ? 'continuas' : 'punteadas'}
                </text>
                <line
                  x1="234"
                  y1="154"
                  x2="300"
                  y2="154"
                  stroke={intColor}
                  strokeWidth="1"
                  strokeOpacity="0.7"
                  strokeDasharray={selectedCell.interiorLine === '...' ? '2 3' : undefined}
                />

                {renderTransitionRow(
                  intRel,
                  266,
                  `cubo interior · ${selectedCell.interiorLabel} (${
                    selectedCell.interiorLine === '_' ? 'continuas _' : 'punteadas ...'
                  })`,
                  'below'
                )}
              </svg>
            );
          })()}

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs space-y-2 font-mono">
            <div className="text-slate-400 text-[11px]">Proyección {selectedCell.id} del teseracto único:</div>
            {selectedCell.relations.map((rel) => {
              const chain = getRelChain(rel);
              const glyphColor = getAnalysisChainColor(chain, rel.domain, isCleanMode);
              const textColor = getAnalysisChainTextColor(chain, rel.domain, isCleanMode);
              const arrowGlyph = rel.arrow === '>' ? '→' : '←';
              const loopGlyph =
                rel.strokeStyle === 'bucle' ? (rel.loopSense === 'antihorario' ? '↺' : '↻') : null;
              return (
                <div
                  key={rel.notation}
                  className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-slate-200"
                >
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px]" aria-label={rel.notation}>
                    <span>{rel.left}</span>
                    <span style={{ color: textColor }}>{loopGlyph ?? arrowGlyph}</span>
                    <CubeGlyph dashed={rel.line === '...'} color={glyphColor} size={14} />
                    <span style={{ color: textColor }}>{loopGlyph ?? arrowGlyph}</span>
                    <span>{rel.right}</span>
                  </span>
                  <span className="text-[10.5px] whitespace-nowrap" style={{ color: textColor }}>
                    {rel.cubeLabel} · {rel.cube}
                    {isCleanMode && rel.strokeStyle
                      ? ` · ${rel.strokeStyle}${rel.loopSense ? ` (${rel.loopSense})` : ''}`
                      : ''}
                    {isCleanMode && rel.leftPolarity && rel.rightPolarity
                      ? ` · ${rel.leftPolarity} | ${rel.rightPolarity}`
                      : chain
                      ? ` · ${chain}`
                      : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
