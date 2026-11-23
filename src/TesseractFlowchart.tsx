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
  type FlowchartCell,
  type FlowEdge,
  type FlowFilter,
  type FlowNode,
  type FlowchartTesseractData,
} from './tesseractFlowGraph';

export type { FlowchartCell, FlowchartRelation, FlowchartTesseractData } from './tesseractFlowGraph';

interface TesseractFlowchartProps {
  tesseractData: FlowchartTesseractData;
  selectedCellId: string;
  onSelectCell: (cellId: string) => void;
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

export function getCubeLabelColor(label: string): string {
  return CUBE_LABEL_COLORS[label] ?? '#94a3b8';
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

export const TesseractMiniSchlegel: React.FC<{ cell: FlowchartCell }> = ({ cell }) => {
  const geom = useMemo(() => buildSchlegelCubeWireframe(90, 58, 34, 15, 16, -9), []);
  const extColor = getCubeLabelColor(cell.exteriorLabel);
  const intColor = getCubeLabelColor(cell.interiorLabel);

  return (
    <svg
      viewBox="0 0 180 116"
      className="w-full h-28 select-none rounded-lg bg-slate-950/70 border border-slate-800/70"
      role="img"
      aria-label={`Teseracto ${cell.id}: cubo exterior ${cell.exteriorLabel} ${
        cell.exteriorLine === '_' ? 'continuo' : 'punteado'
      }, cubo interior ${cell.interiorLabel} ${
        cell.interiorLine === '_' ? 'continuo' : 'punteado'
      }`}
    >
      <text x="8" y="14" fill={extColor} fontSize="8.5" fontFamily="monospace">
        ext: {cell.exteriorLabel} ({cell.exteriorLine === '_' ? 'continuas' : 'punteadas'})
      </text>
      <text x="172" y="108" textAnchor="end" fill={intColor} fontSize="8.5" fontFamily="monospace">
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
}) => {
  const [flowFilter, setFlowFilter] = useState<FlowFilter>('all');
  const [focusedConcept, setFocusedConcept] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<FlowEdge | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const customPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const [layoutVersion, setLayoutVersion] = useState(0);

  const selectedCell = useMemo(
    () => tesseractData.cells.find((c) => c.id === selectedCellId) ?? tesseractData.cells[0],
    [tesseractData.cells, selectedCellId]
  );

  const baseGraph = useMemo(
    () => buildTesseractFlowGraph(tesseractData, flowFilter),
    [tesseractData, flowFilter]
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
        label: isTwoCol
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
        const color = d.rel.domain === 'real' ? '#38bdf8' : '#f59e0b';
        const marker = d.rel.domain === 'real' ? 'url(#d3-flow-real)' : 'url(#d3-flow-virtual)';

        const sel = d3.select(this);
        sel
          .select<SVGPathElement>('path.d3-link-visible')
          .attr('d', geom.path)
          .attr('stroke', color)
          .attr('stroke-width', highlighted ? 2.8 : 1.35)
          .attr('stroke-opacity', highlighted ? 0.98 : 0.34)
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
        const color = d.rel.domain === 'real' ? '#38bdf8' : '#f59e0b';

        const badge = d3.select(this);
        badge
          .attr('transform', `translate(${geom.labelX.toFixed(1)}, ${geom.labelY.toFixed(1)})`)
          .style('opacity', highlighted ? '1' : '0');
        badge
          .select('rect')
          .attr('fill', '#020617')
          .attr('stroke', color)
          .attr('stroke-width', 1);
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
  }, [baseGraph, selectedCell, selectedCellConcepts, focusedConcept, layoutVersion]);

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

  return (
    <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <GitCommitHorizontal className="w-4 h-4 text-sky-400" />
            Diagrama de Flujo D3: Transiciones Reales (›) y Virtuales (‹)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Renderizado dinámicamente con <code className="text-sky-300">d3</code> desde{' '}
            <code className="text-sky-300">tesseractData</code> ({baseGraph.nodes.length} conceptos,{' '}
            {baseGraph.edges.length} transiciones activas). Arrastra nodos, haz clic en un concepto o
            arista para inspeccionar.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex shrink-0 rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
            {(
              [
                { id: 'all', label: 'Todos (16)' },
                { id: 'real', label: 'Real › (8)' },
                { id: 'virtual', label: 'Virtual ‹ (8)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFlowFilter(opt.id)}
                className={`px-2.5 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
                  flowFilter === opt.id
                    ? 'bg-sky-500/20 text-sky-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
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
            aria-label="Diagrama de flujo D3 de transiciones de evolución e involución"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-sky-400 inline-block" /> real (&gt;)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-amber-400 inline-block" /> virtual (&lt;)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                continuas (_) / punteadas (...)
              </span>
            </div>
            {hoveredEdge ? (
              <span className="text-slate-200 truncate">
                {hoveredEdge.cellId} ({hoveredEdge.rel.cubeLabel}): {hoveredEdge.rel.notation} [
                {hoveredEdge.rel.cube} · {hoveredEdge.rel.domain}]
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
              <div className="text-[11px] font-mono text-slate-400">{selectedCell.half}</div>
              <h4 className="text-sm font-semibold font-mono text-white">
                {selectedCell.id} · {selectedCell.axisPair}
              </h4>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span
                className="px-2 py-0.5 rounded border bg-slate-900/90"
                style={{
                  color: getCubeLabelColor(selectedCell.exteriorLabel),
                  borderColor: `${getCubeLabelColor(selectedCell.exteriorLabel)}55`,
                }}
              >
                ext: {selectedCell.exteriorLabel} ({selectedCell.exteriorLine === '_' ? 'continuas' : 'punteadas'})
              </span>
              <span
                className="px-2 py-0.5 rounded border bg-slate-900/90"
                style={{
                  color: getCubeLabelColor(selectedCell.interiorLabel),
                  borderColor: `${getCubeLabelColor(selectedCell.interiorLabel)}55`,
                }}
              >
                int: {selectedCell.interiorLabel} ({selectedCell.interiorLine === '_' ? 'continuas' : 'punteadas'})
              </span>
            </div>
          </div>

          {(() => {
            const schlegel = buildSchlegelCubeWireframe(210, 152, 56, 25, 24, -14);
            const extColor = getCubeLabelColor(selectedCell.exteriorLabel);
            const intColor = getCubeLabelColor(selectedCell.interiorLabel);
            const extRel = selectedCell.relations.find((r) => r.cube === 'exterior') ?? selectedCell.relations[0];
            const intRel = selectedCell.relations.find((r) => r.cube === 'interior') ?? selectedCell.relations[1];

            const renderTransitionRow = (rel: typeof extRel, y: number, label: string) => {
              if (!rel) return null;
              const stroke = rel.domain === 'real' ? '#38bdf8' : '#f59e0b';
              const isRight = rel.arrow === '>';
              return (
                <g key={`${rel.cube}-${rel.notation}`}>
                  <text
                    x="210"
                    y={y - 22}
                    textAnchor="middle"
                    fill={stroke}
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {label}
                  </text>
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
                    markerEnd={rel.domain === 'real' ? 'url(#schlegel-real)' : 'url(#schlegel-virtual)'}
                  />
                  {/* Inline mini 3D cube glyph (solid vs dashed) mirroring TSST_20261123_003603 diagram */}
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
                    fill={stroke}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {rel.arrow === '>' ? '→ real →' : '← virtual ←'}
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
                viewBox="0 0 420 296"
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
                </defs>

                {renderTransitionRow(
                  extRel,
                  36,
                  `cubo exterior · ${selectedCell.exteriorLabel} (${
                    selectedCell.exteriorLine === '_' ? 'líneas continuas _' : 'líneas punteadas ...'
                  })`
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
                <text x="16" y="142" fill={extColor} fontSize="9.5" fontFamily="monospace">
                  cubo exterior
                </text>
                <text x="16" y="155" fill={extColor} fontSize="9" fontFamily="monospace" opacity="0.85">
                  {selectedCell.exteriorLabel} · {selectedCell.exteriorLine === '_' ? 'continuas' : 'punteadas'}
                </text>
                <line
                  x1="108"
                  y1="146"
                  x2="142"
                  y2="146"
                  stroke={extColor}
                  strokeWidth="1"
                  strokeOpacity="0.65"
                  strokeDasharray={selectedCell.exteriorLine === '...' ? '2 3' : undefined}
                />

                <text x="404" y="142" textAnchor="end" fill={intColor} fontSize="9.5" fontFamily="monospace">
                  cubo interior
                </text>
                <text x="404" y="155" textAnchor="end" fill={intColor} fontSize="9" fontFamily="monospace" opacity="0.85">
                  {selectedCell.interiorLabel} · {selectedCell.interiorLine === '_' ? 'continuas' : 'punteadas'}
                </text>
                <line
                  x1="234"
                  y1="146"
                  x2="300"
                  y2="146"
                  stroke={intColor}
                  strokeWidth="1"
                  strokeOpacity="0.65"
                  strokeDasharray={selectedCell.interiorLine === '...' ? '2 3' : undefined}
                />

                {renderTransitionRow(
                  intRel,
                  268,
                  `cubo interior · ${selectedCell.interiorLabel} (${
                    selectedCell.interiorLine === '_' ? 'líneas continuas _' : 'líneas punteadas ...'
                  })`
                )}
              </svg>
            );
          })()}

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs space-y-2 font-mono">
            <div className="text-slate-400 text-[11px]">Proyección {selectedCell.id} del teseracto único:</div>
            {selectedCell.relations.map((rel) => {
              const glyphColor = rel.domain === 'real' ? '#38bdf8' : '#f59e0b';
              const arrowGlyph = rel.arrow === '>' ? '→' : '←';
              return (
                <div
                  key={rel.notation}
                  className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-slate-200"
                >
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px]" aria-label={rel.notation}>
                    <span>{rel.left}</span>
                    <span style={{ color: glyphColor }}>{arrowGlyph}</span>
                    <CubeGlyph dashed={rel.line === '...'} color={glyphColor} size={14} />
                    <span style={{ color: glyphColor }}>{arrowGlyph}</span>
                    <span>{rel.right}</span>
                  </span>
                  <span
                    className={`text-[10.5px] whitespace-nowrap ${
                      rel.domain === 'real' ? 'text-sky-300' : 'text-amber-300'
                    }`}
                  >
                    {rel.cubeLabel} · {rel.cube} ({rel.line === '_' ? 'continuas' : 'punteadas'})
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
