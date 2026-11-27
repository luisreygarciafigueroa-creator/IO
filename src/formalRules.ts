export type RelationLabel = 'none' | 'mirrorOf' | 'creates';

export interface EvaluatedPairRule {
  source: string;
  target: string;
  sameTriad: boolean;
  oppositePhase: boolean;
  mirrorPositional: boolean;
  createsPositional: boolean;
  relation: RelationLabel;
  explanation: string;
}

export function parseNodeId(nodeId: string): { triad: number; phase: string; pos: number } {
  const parts = nodeId.split('_');
  return {
    triad: Number(parts[0].slice(1)),
    phase: parts[1],
    pos: Number(parts[2].slice(1)),
  };
}

export function ruleLabel(src: string, tgt: string): RelationLabel {
  const s = parseNodeId(src);
  const t = parseNodeId(tgt);
  if (s.triad !== t.triad) return 'none';
  if (s.phase === t.phase) return 'none';
  if (t.pos === 2 - s.pos) return 'mirrorOf';
  if (((s.pos === 0 || s.pos === 2) && t.pos === 1) || (s.pos === 1 && (t.pos === 0 || t.pos === 2))) {
    return 'creates';
  }
  return 'none';
}

export function evaluatePairRule(src: string, tgt: string): EvaluatedPairRule {
  const s = parseNodeId(src);
  const t = parseNodeId(tgt);
  const sameTriad = s.triad === t.triad;
  const oppositePhase = s.phase !== t.phase;
  const mirrorPos = t.pos === 2 - s.pos;
  const createsPos =
    ((s.pos === 0 || s.pos === 2) && t.pos === 1) ||
    (s.pos === 1 && (t.pos === 0 || t.pos === 2));
  const relation = ruleLabel(src, tgt);

  let explanation = 'Sin relación operativa (misma fase o fuera de misma tríada).';
  if (!sameTriad) {
    explanation = 'sameTriad falso: los nodos pertenecen a tríadas distintas → none.';
  } else if (!oppositePhase) {
    explanation = 'oppositePhase falso: ambos nodos están en la misma fase → none.';
  } else if (relation === 'mirrorOf') {
    explanation = `isMirrorRel verdadero: misma tríada (T${String(s.triad).padStart(2, '0')}), fase opuesta (${s.phase} ↔ ${t.phase}) y posición espejada (${s.pos} ↔ ${t.pos} = 2 - ${s.pos}).`;
  } else if (relation === 'creates') {
    explanation = `isCreatesRel verdadero: misma tríada (T${String(s.triad).padStart(2, '0')}), fase opuesta (${s.phase} ↔ ${t.phase}) y lateral ↔ centro (${s.pos} → ${t.pos}).`;
  }

  return {
    source: src,
    target: tgt,
    sameTriad,
    oppositePhase,
    mirrorPositional: mirrorPos,
    createsPositional: createsPos,
    relation,
    explanation,
  };
}
