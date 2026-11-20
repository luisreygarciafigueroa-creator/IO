export type FlowFilter = 'all' | 'evolucion' | 'involucion';

export interface FlowchartRelation {
  left: string;
  arrow: '>' | '<';
  line: '_' | '...';
  right: string;
  domain: 'real' | 'virtual';
  cube: 'exterior' | 'interior';
  notation: string;
}

export interface FlowchartCell {
  id: string;
  index: number;
  row: 'superior' | 'inferior';
  col: 1 | 2 | 3 | 4;
  perspective: 'evolucion' | 'involucion';
  exteriorDomain: 'real' | 'virtual';
  exteriorLine: '_' | '...';
  interiorDomain: 'real' | 'virtual';
  interiorLine: '_' | '...';
  coords: [0 | 1, 0 | 1, 0 | 1];
  parity: 0 | 1;
  half: string;
  relations: [FlowchartRelation, FlowchartRelation];
  neighbors: {
    horizontal: string;
    vertical: string;
    diagonal: string;
  };
}

export interface FlowchartTesseractData {
  concepts: string[];
  cells: FlowchartCell[];
}

export interface FlowNode {
  id: string;
  role: 'origen' | 'mediador' | 'polo' | 'transversal' | 'aislado';
  tier: 0 | 1 | 2;
  x: number;
  y: number;
  inDegree: number;
  outDegree: number;
  evolCount: number;
  involCount: number;
  cellIds: string[];
}

export interface FlowEdge {
  id: string;
  cellId: string;
  perspective: 'evolucion' | 'involucion';
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
export const FLOW_NODE_WIDTH = 122;
export const FLOW_NODE_HEIGHT = 40;

export function buildTesseractFlowGraph(
  tesseractData: FlowchartTesseractData,
  filter: FlowFilter = 'all'
): FlowGraph {
  const conceptSet = new Set<string>(tesseractData.concepts);
  for (const cell of tesseractData.cells) {
    for (const rel of cell.relations) {
      conceptSet.add(rel.left);
      conceptSet.add(rel.right);
    }
  }

  const allTransitions: Array<{
    cellId: string;
    perspective: 'evolucion' | 'involucion';
    source: string;
    target: string;
    rel: FlowchartRelation;
  }> = [];

  // Compute global node stats from all cells so node roles stay stable across filters
  const inCountGlobal = new Map<string, number>();
  const outCountGlobal = new Map<string, number>();

  for (const cell of tesseractData.cells) {
    for (const rel of cell.relations) {
      const source = rel.arrow === '>' ? rel.left : rel.right;
      const target = rel.arrow === '>' ? rel.right : rel.left;
      outCountGlobal.set(source, (outCountGlobal.get(source) ?? 0) + 1);
      inCountGlobal.set(target, (inCountGlobal.get(target) ?? 0) + 1);
      allTransitions.push({
        cellId: cell.id,
        perspective: cell.perspective,
        source,
        target,
        rel,
      });
    }
  }

  const filteredTransitions =
    filter === 'all'
      ? allTransitions
      : allTransitions.filter((t) => t.perspective === filter);

  // Per-filter node counts
  const inCount = new Map<string, number>();
  const outCount = new Map<string, number>();
  const evolCount = new Map<string, number>();
  const involCount = new Map<string, number>();
  const cellIdSets = new Map<string, Set<string>>();

  for (const t of filteredTransitions) {
    outCount.set(t.source, (outCount.get(t.source) ?? 0) + 1);
    inCount.set(t.target, (inCount.get(t.target) ?? 0) + 1);

    if (t.perspective === 'evolucion') {
      evolCount.set(t.source, (evolCount.get(t.source) ?? 0) + 1);
      evolCount.set(t.target, (evolCount.get(t.target) ?? 0) + 1);
    } else {
      involCount.set(t.source, (involCount.get(t.source) ?? 0) + 1);
      involCount.set(t.target, (involCount.get(t.target) ?? 0) + 1);
    }

    if (!cellIdSets.has(t.source)) cellIdSets.set(t.source, new Set());
    if (!cellIdSets.has(t.target)) cellIdSets.set(t.target, new Set());
    cellIdSets.get(t.source)!.add(t.cellId);
    cellIdSets.get(t.target)!.add(t.cellId);
  }

  // Group concepts dynamically into flowchart tiers based on topology
  const hasIntermediates = [...conceptSet].some(
    (c) => (inCountGlobal.get(c) ?? 0) > 0 && (outCountGlobal.get(c) ?? 0) > 0
  );

  const tierMap = new Map<string, 0 | 1 | 2>();
  const roleMap = new Map<string, FlowNode['role']>();

  for (const c of conceptSet) {
    const gIn = inCountGlobal.get(c) ?? 0;
    const gOut = outCountGlobal.get(c) ?? 0;

    if (gIn === 0 && gOut === 0) {
      tierMap.set(c, 1);
      roleMap.set(c, 'aislado');
    } else if (gIn === 0 && gOut > 0) {
      tierMap.set(c, 0);
      roleMap.set(c, c === 'universo' ? 'origen' : 'mediador');
    } else if (gIn > 0 && gOut > 0) {
      tierMap.set(c, 1);
      roleMap.set(c, 'mediador');
    } else {
      tierMap.set(c, hasIntermediates ? 2 : 1);
      roleMap.set(c, c === 'mictlan' ? 'transversal' : 'polo');
    }
  }

  const tierGroups = new Map<0 | 1 | 2, string[]>();
  for (const c of conceptSet) {
    const t = tierMap.get(c) ?? 1;
    if (!tierGroups.has(t)) tierGroups.set(t, []);
    tierGroups.get(t)!.push(c);
  }

  // Order tiers cleanly for readability
  const preferredOrder: Record<string, number> = {
    universo: 0,
    internet: 1,
    IA: 2,
    cuerpo: 3,
    materia: 4,
    vacio: 5,
    mictlan: 6,
  };

  const activeTiers = ([0, 1, 2] as const).filter((t) => (tierGroups.get(t)?.length ?? 0) > 0);
  const xByTier = new Map<0 | 1 | 2, number>();
  if (activeTiers.length === 1) {
    xByTier.set(activeTiers[0], FLOW_VIEWBOX_WIDTH / 2);
  } else if (activeTiers.length === 2) {
    xByTier.set(activeTiers[0], 112);
    xByTier.set(activeTiers[1], FLOW_VIEWBOX_WIDTH - 112);
  } else {
    xByTier.set(0, 98);
    xByTier.set(1, FLOW_VIEWBOX_WIDTH / 2);
    xByTier.set(2, FLOW_VIEWBOX_WIDTH - 98);
  }

  const nodes: FlowNode[] = [];
  const paddingY = 58;
  const usableH = FLOW_VIEWBOX_HEIGHT - paddingY * 2;

  for (const tier of activeTiers) {
    const list = (tierGroups.get(tier) ?? []).slice().sort((a, b) => {
      const pa = preferredOrder[a] ?? 99;
      const pb = preferredOrder[b] ?? 99;
      return pa !== pb ? pa - pb : a.localeCompare(b);
    });
    const count = list.length;
    list.forEach((id, idx) => {
      const y =
        count === 1
          ? FLOW_VIEWBOX_HEIGHT / 2
          : paddingY + (usableH * idx) / (count - 1);
      nodes.push({
        id,
        role: roleMap.get(id) ?? 'mediador',
        tier,
        x: xByTier.get(tier) ?? FLOW_VIEWBOX_WIDTH / 2,
        y: Math.round(y),
        inDegree: inCount.get(id) ?? 0,
        outDegree: outCount.get(id) ?? 0,
        evolCount: evolCount.get(id) ?? 0,
        involCount: involCount.get(id) ?? 0,
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
    bucket.forEach((t, idx) => {
      const curveOffset = n === 1 ? 0 : (idx - (n - 1) / 2) * 34;
      edges.push({
        id: `${t.cellId}-${t.rel.cube}-${t.rel.domain}-${idx}`,
        cellId: t.cellId,
        perspective: t.perspective,
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

