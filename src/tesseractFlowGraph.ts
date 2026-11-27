export type AnalysisChainColor = 'azul' | 'amarillo' | 'rojo' | 'verde';
export type TesseractColoringId =
  | 'mirrorReflected'
  | 'mirror'
  | 'mirrorFrameSwap'
  | 'mirrorFrameSwapMirror'
  | 'mirrorSetTop'
  | 'mirrorSetTopMirror'
  | 'parityPolarMirror'
  | 'parityPolarSwap'
  | 'paritySetTop'
  | 'paritySetBottom'
  | 'parityMirror'
  | 'parity';
export type TesseractColorMode = 'clean' | TesseractColoringId;
export type TesseractColoringFamily = 'mirror' | 'parity';
export type FlowFilter = 'all' | 'real' | 'virtual' | AnalysisChainColor;

export interface TesseractColoringChainSpec {
  id: AnalysisChainColor;
  label: string;
  cellIds: string[];
  cubeLabels: string[];
  parity?: 0 | 1;
  arrow?: '>' | '<';
  domain?: 'real' | 'virtual';
  modalSwap?: string;
  summary: string;
}

export interface TesseractColoringSpec {
  id: TesseractColoringId;
  shortLabel: string;
  title: string;
  family: TesseractColoringFamily;
  assetPath: string;
  assetTag: string;
  mirrorPartnerId: TesseractColoringId;
  mirrorPartnerLabel: string;
  involutionRule: string;
  involutionMap: Record<AnalysisChainColor, AnalysisChainColor>;
  summary: string;
  filterHint: string;
  chains: TesseractColoringChainSpec[];
  balanced: boolean;
}

export interface FlowchartRelation {
  left: string;
  arrow: '>' | '<';
  line: '_' | '...';
  right: string;
  domain: 'real' | 'virtual';
  cube: 'exterior' | 'interior';
  cubeLabel: string;
  analysisChain?: AnalysisChainColor;
  mirrorChain?: AnalysisChainColor;
  parityMirrorChain?: AnalysisChainColor;
  mirrorReflectedChain?: AnalysisChainColor;
  chains?: Partial<Record<TesseractColorMode, AnalysisChainColor>>;
  leftPolarity?: 'individualidad' | 'totalidad';
  rightPolarity?: 'individualidad' | 'totalidad';
  strokeStyle?: 'recta' | 'bucle';
  loopSense?: 'antihorario' | 'horario';
  notation: string;
}

export interface FlowchartCell {
  id: string;
  index: number;
  row: 'superior' | 'inferior';
  col: 1 | 2 | 3 | 4;
  axisPair: string;
  exteriorLabel: string;
  exteriorLine: '_' | '...';
  exteriorChain?: AnalysisChainColor;
  exteriorMirrorChain?: AnalysisChainColor;
  exteriorParityMirrorChain?: AnalysisChainColor;
  exteriorMirrorReflectedChain?: AnalysisChainColor;
  exteriorChains?: Partial<Record<TesseractColorMode, AnalysisChainColor>>;
  interiorLabel: string;
  interiorLine: '_' | '...';
  interiorChain?: AnalysisChainColor;
  interiorMirrorChain?: AnalysisChainColor;
  interiorParityMirrorChain?: AnalysisChainColor;
  interiorMirrorReflectedChain?: AnalysisChainColor;
  interiorChains?: Partial<Record<TesseractColorMode, AnalysisChainColor>>;
  coords: [0 | 1, 0 | 1, 0 | 1];
  parity: 0 | 1;
  half: string;
  polarityLeft?: string;
  polarityRight?: string;
  domainLegend?: 'continuo = real' | 'punteado = real';
  relations: [FlowchartRelation, FlowchartRelation];
  neighbors: {
    horizontal: string;
    vertical: string;
    diagonal: string;
  };
}

export interface FlowchartCleanForm {
  assetPath: string;
  figura3AssetPath?: string;
  priorAssetPath?: string;
  tsst13AssetPath?: string;
  legacyAssetPath?: string;
  assetTag: string;
  title: string;
  summary: string;
  cells: FlowchartCell[];
}

export interface FlowchartTesseractData {
  concepts: string[];
  colorings?: TesseractColoringSpec[];
  cells: FlowchartCell[];
  cleanForm?: FlowchartCleanForm;
}

export interface FlowNode {
  id: string;
  role: 'corporal' | 'digital' | 'estructural' | 'mediador' | 'polo' | 'aislado';
  tier: 0 | 1 | 2;
  x: number;
  y: number;
  inDegree: number;
  outDegree: number;
  realCount: number;
  virtualCount: number;
  cellIds: string[];
}

export interface FlowEdge {
  id: string;
  cellId: string;
  axisPair: string;
  domain: 'real' | 'virtual';
  source: string;
  target: string;
  rel: FlowchartRelation;
  curveOffset: number;
}

export interface FlowGraph {
  width: number;
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const FLOW_VIEWBOX_WIDTH = 580;
export const FLOW_VIEWBOX_HEIGHT = 400;
export const FLOW_NODE_WIDTH = 132;
export const FLOW_NODE_HEIGHT = 40;

export function buildTesseractFlowGraph(
  tesseractData: FlowchartTesseractData,
  filter: FlowFilter = 'all',
  colorMode: TesseractColorMode = 'mirrorReflected'
): FlowGraph {
  const activeCells =
    colorMode === 'clean' && tesseractData.cleanForm?.cells?.length
      ? tesseractData.cleanForm.cells
      : tesseractData.cells;

  const conceptSet = new Set<string>(tesseractData.concepts);
  for (const cell of activeCells) {
    for (const rel of cell.relations) {
      conceptSet.add(rel.left);
      conceptSet.add(rel.right);
    }
  }

  const allTransitions: Array<{
    cellId: string;
    axisPair: string;
    domain: 'real' | 'virtual';
    source: string;
    target: string;
    rel: FlowchartRelation;
  }> = [];

  const inCountGlobal = new Map<string, number>();
  const outCountGlobal = new Map<string, number>();
  const undirectedAdj = new Map<string, Set<string>>();

  for (const c of conceptSet) {
    undirectedAdj.set(c, new Set());
  }

  for (const cell of activeCells) {
    for (const rel of cell.relations) {
      const source = rel.arrow === '>' ? rel.left : rel.right;
      const target = rel.arrow === '>' ? rel.right : rel.left;
      outCountGlobal.set(source, (outCountGlobal.get(source) ?? 0) + 1);
      inCountGlobal.set(target, (inCountGlobal.get(target) ?? 0) + 1);
      undirectedAdj.get(source)?.add(target);
      undirectedAdj.get(target)?.add(source);
      allTransitions.push({
        cellId: cell.id,
        axisPair: cell.axisPair,
        domain: rel.domain,
        source,
        target,
        rel,
      });
    }
  }

  const resolveRelColor = (rel: FlowchartRelation): AnalysisChainColor | undefined => {
    if (colorMode === 'clean') return undefined;
    if (rel.chains?.[colorMode]) return rel.chains[colorMode];
    if (colorMode === 'mirrorReflected') {
      return rel.mirrorReflectedChain ?? rel.mirrorChain ?? rel.parityMirrorChain ?? rel.analysisChain;
    }
    if (colorMode === 'parityMirror') {
      return rel.parityMirrorChain ?? rel.mirrorChain ?? rel.analysisChain;
    }
    if (colorMode === 'mirror') {
      return rel.mirrorChain ?? rel.analysisChain;
    }
    return rel.analysisChain;
  };

  const filteredTransitions =
    filter === 'all'
      ? allTransitions
      : filter === 'real' || filter === 'virtual'
      ? allTransitions.filter((t) => t.domain === filter)
      : allTransitions.filter((t) => resolveRelColor(t.rel) === filter);

  const inCount = new Map<string, number>();
  const outCount = new Map<string, number>();
  const realCount = new Map<string, number>();
  const virtualCount = new Map<string, number>();
  const cellIdSets = new Map<string, Set<string>>();

  for (const t of filteredTransitions) {
    outCount.set(t.source, (outCount.get(t.source) ?? 0) + 1);
    inCount.set(t.target, (inCount.get(t.target) ?? 0) + 1);

    if (t.domain === 'real') {
      realCount.set(t.source, (realCount.get(t.source) ?? 0) + 1);
      realCount.set(t.target, (realCount.get(t.target) ?? 0) + 1);
    } else {
      virtualCount.set(t.source, (virtualCount.get(t.source) ?? 0) + 1);
      virtualCount.set(t.target, (virtualCount.get(t.target) ?? 0) + 1);
    }

    if (!cellIdSets.has(t.source)) cellIdSets.set(t.source, new Set());
    if (!cellIdSets.has(t.target)) cellIdSets.set(t.target, new Set());
    cellIdSets.get(t.source)!.add(t.cellId);
    cellIdSets.get(t.target)!.add(t.cellId);
  }

  const connectedConcepts = [...conceptSet].filter(
    (c) => (inCountGlobal.get(c) ?? 0) > 0 || (outCountGlobal.get(c) ?? 0) > 0
  );
  const allBidirectional =
    connectedConcepts.length > 0 &&
    connectedConcepts.every(
      (c) => (inCountGlobal.get(c) ?? 0) > 0 && (outCountGlobal.get(c) ?? 0) > 0
    );

  const tierMap = new Map<string, 0 | 1 | 2>();
  const roleMap = new Map<string, FlowNode['role']>();

  const assignConceptRole = (c: string): FlowNode['role'] => {
    if (c === 'cuerpo' || c === 'universo') return 'corporal';
    if (c === 'internet' || c === 'IA') return 'digital';
    if (c === 'individualidad' || c === 'totalidad') return 'estructural';
    return 'mediador';
  };

  if (allBidirectional) {
    // Reciprocal dual-pair layout: place paired concepts on opposite columns (tier 0 left, tier 2 right)
    const preferredLeft = new Set(['cuerpo', 'internet', 'individualidad']);
    const preferredRight = new Set(['universo', 'IA', 'totalidad']);
    const orderedSeeds = [...conceptSet].sort((a, b) => {
      const aPref = preferredLeft.has(a) ? 0 : preferredRight.has(a) ? 2 : 1;
      const bPref = preferredLeft.has(b) ? 0 : preferredRight.has(b) ? 2 : 1;
      return aPref !== bPref ? aPref - bPref : a.localeCompare(b);
    });

    for (const seed of orderedSeeds) {
      if ((inCountGlobal.get(seed) ?? 0) === 0 && (outCountGlobal.get(seed) ?? 0) === 0) {
        tierMap.set(seed, 1);
        roleMap.set(seed, 'aislado');
        continue;
      }
      if (tierMap.has(seed)) continue;

      const startTier: 0 | 2 = preferredRight.has(seed) ? 2 : 0;
      tierMap.set(seed, startTier);
      roleMap.set(seed, assignConceptRole(seed));

      const queue: string[] = [seed];
      while (queue.length > 0) {
        const cur = queue.shift()!;
        const curTier = tierMap.get(cur) ?? 0;
        const nextTier: 0 | 2 = curTier === 0 ? 2 : 0;
        for (const nbr of undirectedAdj.get(cur) ?? []) {
          if (!tierMap.has(nbr)) {
            tierMap.set(nbr, nextTier);
            roleMap.set(nbr, assignConceptRole(nbr));
            queue.push(nbr);
          }
        }
      }
    }
  } else {
    // Hierarchical source -> intermediate -> sink layout for DAG / custom inputs
    const hasIntermediates = [...conceptSet].some(
      (c) => (inCountGlobal.get(c) ?? 0) > 0 && (outCountGlobal.get(c) ?? 0) > 0
    );

    for (const c of conceptSet) {
      const gIn = inCountGlobal.get(c) ?? 0;
      const gOut = outCountGlobal.get(c) ?? 0;

      if (gIn === 0 && gOut === 0) {
        tierMap.set(c, 1);
        roleMap.set(c, 'aislado');
      } else if (gIn === 0 && gOut > 0) {
        tierMap.set(c, 0);
        roleMap.set(c, 'mediador');
      } else if (gIn > 0 && gOut > 0) {
        tierMap.set(c, 1);
        roleMap.set(c, 'mediador');
      } else {
        tierMap.set(c, hasIntermediates ? 2 : 1);
        roleMap.set(c, 'polo');
      }
    }
  }

  const tierGroups = new Map<0 | 1 | 2, string[]>();
  for (const c of conceptSet) {
    const t = tierMap.get(c) ?? 1;
    if (!tierGroups.has(t)) tierGroups.set(t, []);
    tierGroups.get(t)!.push(c);
  }

  // Order tiers cleanly so dual pairs align horizontally across rows
  const preferredOrder: Record<string, number> = {
    cuerpo: 0,
    universo: 0,
    internet: 1,
    IA: 1,
    individualidad: 2,
    totalidad: 2,
  };

  const activeTiers = ([0, 1, 2] as const).filter((t) => (tierGroups.get(t)?.length ?? 0) > 0);
  const xByTier = new Map<0 | 1 | 2, number>();
  if (activeTiers.length === 1) {
    xByTier.set(activeTiers[0], FLOW_VIEWBOX_WIDTH / 2);
  } else if (activeTiers.length === 2) {
    xByTier.set(activeTiers[0], 116);
    xByTier.set(activeTiers[1], FLOW_VIEWBOX_WIDTH - 116);
  } else {
    xByTier.set(0, 98);
    xByTier.set(1, FLOW_VIEWBOX_WIDTH / 2);
    xByTier.set(2, FLOW_VIEWBOX_WIDTH - 98);
  }

  const nodes: FlowNode[] = [];
  const paddingY = 70;
  const usableH = FLOW_VIEWBOX_HEIGHT - paddingY * 2;

  for (const tier of activeTiers) {
    const list = (tierGroups.get(tier) ?? []).slice().sort((a, b) => {
      const pa = preferredOrder[a] ?? 99;
      const pb = preferredOrder[b] ?? 99;
      return pa !== pb ? pa - pb : a.localeCompare(b);
    });
    const count = list.length;
    const isIsolatedCenterBand =
      tier === 1 &&
      activeTiers.length === 3 &&
      list.every((id) => roleMap.get(id) === 'aislado');
    list.forEach((id, idx) => {
      let y: number;
      if (isIsolatedCenterBand) {
        const bandStep = 72;
        const startY = FLOW_VIEWBOX_HEIGHT / 2 - ((count - 1) * bandStep) / 2;
        y = startY + idx * bandStep;
      } else {
        y =
          count === 1
            ? FLOW_VIEWBOX_HEIGHT / 2
            : paddingY + (usableH * idx) / (count - 1);
      }
      nodes.push({
        id,
        role: roleMap.get(id) ?? 'mediador',
        tier,
        x: xByTier.get(tier) ?? FLOW_VIEWBOX_WIDTH / 2,
        y: Math.round(y),
        inDegree: inCount.get(id) ?? 0,
        outDegree: outCount.get(id) ?? 0,
        realCount: realCount.get(id) ?? 0,
        virtualCount: virtualCount.get(id) ?? 0,
        cellIds: [...(cellIdSets.get(id) ?? [])],
      });
    });
  }

  // Group edges between the same unordered node pair to fan out parallel curves evenly
  const pairBuckets = new Map<string, typeof filteredTransitions>();
  for (const t of filteredTransitions) {
    const key = [t.source, t.target].sort().join('::');
    if (!pairBuckets.has(key)) pairBuckets.set(key, []);
    pairBuckets.get(key)!.push(t);
  }

  const edges: FlowEdge[] = [];
  for (const bucket of pairBuckets.values()) {
    const n = bucket.length;
    const step = n > 4 ? 22 : 34;
    bucket.forEach((t, idx) => {
      const curveOffset = n === 1 ? 0 : (idx - (n - 1) / 2) * step;
      edges.push({
        id: `${t.cellId}-${t.rel.cube}-${t.rel.domain}-${idx}`,
        cellId: t.cellId,
        axisPair: t.axisPair,
        domain: t.domain,
        source: t.source,
        target: t.target,
        rel: t.rel,
        curveOffset,
      });
    });
  }

  return {
    width: FLOW_VIEWBOX_WIDTH,
    height: FLOW_VIEWBOX_HEIGHT,
    nodes,
    edges,
  };
}

export function computeBezierEdgeGeometry(
  source: { x: number; y: number },
  target: { x: number; y: number },
  curveOffset: number,
  nodeWidth = FLOW_NODE_WIDTH,
  nodeHeight = FLOW_NODE_HEIGHT
): {
  path: string;
  labelX: number;
  labelY: number;
} {
  const halfW = nodeWidth / 2;
  const halfH = nodeHeight / 2;

  if (source.x === target.x && source.y === target.y) {
    // Self-loop fallback if any custom tesseractData has self-relation
    const sx = source.x + halfW;
    const sy = source.y - 8;
    const tx = source.x + halfW;
    const ty = source.y + 8;
    return {
      path: `M ${sx} ${sy} C ${sx + 56} ${sy - 34}, ${tx + 56} ${ty + 34}, ${tx} ${ty}`,
      labelX: sx + 42,
      labelY: source.y,
    };
  }

  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.hypot(dx, dy) || 1;

  // Intersect ray with node bounding box
  const scaleBoundary = (vx: number, vy: number) => {
    const sx = Math.abs(vx) > 1e-6 ? halfW / Math.abs(vx) : Infinity;
    const sy = Math.abs(vy) > 1e-6 ? halfH / Math.abs(vy) : Infinity;
    return Math.min(sx, sy);
  };

  const sFactor = scaleBoundary(dx, dy);
  const tFactor = scaleBoundary(-dx, -dy);

  const startX = source.x + dx * sFactor;
  const startY = source.y + dy * sFactor;
  const endX = target.x - dx * tFactor;
  const endY = target.y - dy * tFactor;

  // Perpendicular normal for quadratic control point
  const nx = -dy / dist;
  const ny = dx / dist;
  const ctrlX = (startX + endX) / 2 + nx * curveOffset;
  const ctrlY = (startY + endY) / 2 + ny * curveOffset;

  // Quadratic Bezier midpoint at t = 0.5
  const labelX = 0.25 * startX + 0.5 * ctrlX + 0.25 * endX;
  const labelY = 0.25 * startY + 0.5 * ctrlY + 0.25 * endY;

  return {
    path: `M ${startX.toFixed(2)} ${startY.toFixed(2)} Q ${ctrlX.toFixed(2)} ${ctrlY.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)}`,
    labelX,
    labelY,
  };
}

export interface SchlegelPoint {
  x: number;
  y: number;
}

export interface SchlegelEdgeSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isFront: boolean;
}

export interface SchlegelWireframeGeometry {
  exteriorVertices: SchlegelPoint[];
  interiorVertices: SchlegelPoint[];
  exteriorEdges: SchlegelEdgeSegment[];
  interiorEdges: SchlegelEdgeSegment[];
  strutEdges: Array<{ x1: number; y1: number; x2: number; y2: number }>;
}

const CUBE_EDGE_PAIRS: ReadonlyArray<[number, number, boolean]> = [
  // Front face (0..3)
  [0, 1, true],
  [1, 2, true],
  [2, 3, true],
  [3, 0, true],
  // Back face (4..7)
  [4, 5, false],
  [5, 6, false],
  [6, 7, false],
  [7, 4, false],
  // Depth edges connecting front & back
  [0, 4, false],
  [1, 5, true],
  [2, 6, true],
  [3, 7, false],
];

export function buildSchlegelCubeWireframe(
  cx: number,
  cy: number,
  outerHalf: number,
  innerHalf: number,
  depthX: number,
  depthY: number
): SchlegelWireframeGeometry {
  const makeCubeVertices = (half: number, dx: number, dy: number): SchlegelPoint[] => {
    const fx = -dx * 0.5;
    const fy = -dy * 0.5;
    const bx = dx * 0.5;
    const by = dy * 0.5;
    return [
      // Front face: top-left, top-right, bottom-right, bottom-left
      { x: cx - half + fx, y: cy - half + fy },
      { x: cx + half + fx, y: cy - half + fy },
      { x: cx + half + fx, y: cy + half + fy },
      { x: cx - half + fx, y: cy + half + fy },
      // Back face: top-left, top-right, bottom-right, bottom-left
      { x: cx - half + bx, y: cy - half + by },
      { x: cx + half + bx, y: cy - half + by },
      { x: cx + half + bx, y: cy + half + by },
      { x: cx - half + bx, y: cy + half + by },
    ];
  };

  const exteriorVertices = makeCubeVertices(outerHalf, depthX, depthY);
  const ratio = outerHalf > 0 ? innerHalf / outerHalf : 0.45;
  const interiorVertices = makeCubeVertices(innerHalf, depthX * ratio, depthY * ratio);

  const mapEdges = (verts: SchlegelPoint[]): SchlegelEdgeSegment[] =>
    CUBE_EDGE_PAIRS.map(([a, b, isFront]) => ({
      x1: verts[a].x,
      y1: verts[a].y,
      x2: verts[b].x,
      y2: verts[b].y,
      isFront,
    }));

  const strutEdges = exteriorVertices.map((ext, i) => ({
    x1: ext.x,
    y1: ext.y,
    x2: interiorVertices[i].x,
    y2: interiorVertices[i].y,
  }));

  return {
    exteriorVertices,
    interiorVertices,
    exteriorEdges: mapEdges(exteriorVertices),
    interiorEdges: mapEdges(interiorVertices),
    strutEdges,
  };
}

