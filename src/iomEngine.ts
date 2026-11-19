import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type RelationLabel = 'none' | 'mirrorOf' | 'creates';
export type EvalLabel = RelationLabel | 'unsure';

export interface IomSpec {
  schema_version: string;
  spec_version: string;
  title: string;
  source_date: string;
  source_note: string;
  triad_index_range: { min: number; max: number };
  positions: {
    indices: number[];
    adv_labels: string[];
    ret_labels: string[];
    perspectives: string[];
    note: string;
  };
  perspectives: string[];
  five_perspectives: Array<{
    id: string;
    label: string;
    index: number;
    kind: string;
    description: string;
  }>;
  perspective_labels: Record<string, string>;
  phases: Record<'adv' | 'ret', { label: string; direction: string; arrow: string }>;
  triads: {
    index_base: number;
    adv: string[][];
    ret: string[][];
    note: string;
  };
  vectors: Array<{
    name: string;
    phase: 'adv' | 'ret';
    labels: string[];
    axis_positions: number[];
    arrow: string;
  }>;
  creation_rules: Array<{
    source_phase: 'adv' | 'ret';
    source_positions: number[];
    target_phase: 'adv' | 'ret';
    target_positions: number[];
  }>;
  expanded_categories: Record<string, string[]>;
  migrations: Array<{
    from_version: string;
    to_version: string;
    description: string;
    date: string;
  }>;
  purpose: {
    id: string;
    label: string;
    definition: string;
    criterion: string;
    chain: string[];
    perspective_roles: Record<string, string>;
    note: string;
  };
}

export interface TriadNode {
  node_id: string;
  triad_index: number;
  phase: 'adv' | 'ret';
  direction: string;
  position_index: number;
  position: string;
  display_label: string;
  perspective: string;
  label: string;
}

export interface VectorStep {
  step_id: string;
  vector: string;
  phase: 'adv' | 'ret';
  step_index: number;
  axis_position: number;
  label: string;
  arrow: string;
}

export interface RelationCandidate {
  triad_index: number;
  source: string;
  target: string;
  relation: RelationLabel;
}

export interface ExpandedCategoryItem {
  id: string;
  level: number;
  label: string;
}

export interface GeneratedArtifacts {
  nodes: TriadNode[];
  vectorSteps: VectorStep[];
  relationCandidates: RelationCandidate[];
  expandedCategories: ExpandedCategoryItem[];
  counts: {
    triads: number;
    nodes: number;
    mirrorDirected: number;
    createsDirected: number;
    noneDirected: number;
    totalCandidates: number;
    vectorSteps: number;
    expandedCategories: number;
    partitionValid: boolean;
  };
  fixedPoint: {
    pass1Hash: string;
    pass2Hash: string;
    idempotent: boolean;
    specVersion: string;
  };
}

const ROOT = process.cwd();

function readJsonFile<T>(relPath: string): T {
  const fullPath = path.join(ROOT, relPath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
}

function parseCsvRows(content: string): Array<Record<string, string>> {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        out.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    out.push(current);
    return out;
  };

  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const vals = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = vals[idx] ?? '';
    });
    return row;
  });
}

export function loadSpec(): IomSpec {
  return readJsonFile<IomSpec>('data/iom_spec.json');
}

function buildOnce(spec: IomSpec): Omit<GeneratedArtifacts, 'fixedPoint'> {
  const indexBase = spec.triads.index_base ?? 1;
  const advRows = spec.triads.adv;
  const retRows = spec.triads.ret;
  const nTriads = advRows.length;
  const positionNamesAdv = ['→', '0', '→'];
  const positionNamesRet = ['←', '0', '←'];
  const perspectiveNames = spec.positions.perspectives;

  const nodes: TriadNode[] = [];
  for (const phase of ['adv', 'ret'] as const) {
    const rows = phase === 'adv' ? advRows : retRows;
    const direction = spec.phases[phase].direction;
    const displayLabels = phase === 'adv' ? spec.positions.adv_labels : spec.positions.ret_labels;
    const posNames = phase === 'adv' ? positionNamesAdv : positionNamesRet;

    rows.forEach((labels, rowIndex) => {
      const triadIdx = indexBase + rowIndex;
      const triadTag = `T${String(triadIdx).padStart(2, '0')}`;
      labels.forEach((label, posIdx) => {
        nodes.push({
          node_id: `${triadTag}_${phase}_P${posIdx}`,
          triad_index: triadIdx,
          phase,
          direction,
          position_index: posIdx,
          position: posNames[posIdx],
          display_label: displayLabels[posIdx],
          perspective: perspectiveNames[posIdx],
          label,
        });
      });
    });
  }

  const relationLookup = new Map<string, RelationLabel>();
  for (let rowIndex = 0; rowIndex < nTriads; rowIndex += 1) {
    const triadIdx = indexBase + rowIndex;
    const triadTag = `T${String(triadIdx).padStart(2, '0')}`;
    for (let posIdx = 0; posIdx < 3; posIdx += 1) {
      const adv = `${triadTag}_adv_P${posIdx}`;
      const ret = `${triadTag}_ret_P${2 - posIdx}`;
      relationLookup.set(`${adv}->${ret}`, 'mirrorOf');
      relationLookup.set(`${ret}->${adv}`, 'mirrorOf');
    }
    for (const rule of spec.creation_rules) {
      for (const sPos of rule.source_positions) {
        for (const tPos of rule.target_positions) {
          const src = `${triadTag}_${rule.source_phase}_P${sPos}`;
          const tgt = `${triadTag}_${rule.target_phase}_P${tPos}`;
          relationLookup.set(`${src}->${tgt}`, 'creates');
        }
      }
    }
  }

  const relationCandidates: RelationCandidate[] = [];
  let mirrorDirected = 0;
  let createsDirected = 0;
  let noneDirected = 0;

  for (let rowIndex = 0; rowIndex < nTriads; rowIndex += 1) {
    const triadIdx = indexBase + rowIndex;
    const triadTag = `T${String(triadIdx).padStart(2, '0')}`;
    const ids: string[] = [];
    for (const phase of ['adv', 'ret'] as const) {
      for (let pos = 0; pos < 3; pos += 1) {
        ids.push(`${triadTag}_${phase}_P${pos}`);
      }
    }
    for (const source of ids) {
      for (const target of ids) {
        if (source === target) continue;
        const relation = relationLookup.get(`${source}->${target}`) ?? 'none';
        if (relation === 'mirrorOf') mirrorDirected += 1;
        else if (relation === 'creates') createsDirected += 1;
        else noneDirected += 1;
        relationCandidates.push({
          triad_index: triadIdx,
          source,
          target,
          relation,
        });
      }
    }
  }

  const vectorSteps: VectorStep[] = [];
  for (const vec of spec.vectors) {
    vec.labels.forEach((label, stepIdx) => {
      vectorSteps.push({
        step_id: `vector_${vec.name.toLowerCase()}_${vec.phase}_${stepIdx}`,
        vector: vec.name,
        phase: vec.phase,
        step_index: stepIdx,
        axis_position: vec.axis_positions[stepIdx],
        label,
        arrow: vec.arrow,
      });
    });
  }

  const expandedCategories: ExpandedCategoryItem[] = [];
  for (const [level, labels] of Object.entries(spec.expanded_categories)) {
    labels.forEach((label, idx) => {
      expandedCategories.push({
        id: `expanded_L${level}_${String(idx + 1).padStart(2, '0')}`,
        level: Number(level),
        label,
      });
    });
  }

  return {
    nodes,
    vectorSteps,
    relationCandidates,
    expandedCategories,
    counts: {
      triads: nTriads,
      nodes: nodes.length,
      mirrorDirected,
      createsDirected,
      noneDirected,
      totalCandidates: relationCandidates.length,
      vectorSteps: vectorSteps.length,
      expandedCategories: expandedCategories.length,
      partitionValid:
        mirrorDirected + createsDirected + noneDirected === 390 &&
        nodes.length === 78 &&
        vectorSteps.length === 20 &&
        mirrorDirected === 78 &&
        createsDirected === 104 &&
        noneDirected === 208,
    },
  };
}

export function generateArtifacts(spec: IomSpec = loadSpec()): GeneratedArtifacts {
  const pass1 = buildOnce(spec);
  const pass2 = buildOnce(spec);
  const hash1 = crypto.createHash('sha256').update(JSON.stringify(pass1)).digest('hex');
  const hash2 = crypto.createHash('sha256').update(JSON.stringify(pass2)).digest('hex');

  return {
    ...pass1,
    fixedPoint: {
      pass1Hash: hash1,
      pass2Hash: hash2,
      idempotent: hash1 === hash2,
      specVersion: spec.spec_version,
    },
  };
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

export function evaluatePairRule(src: string, tgt: string) {
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

function featureKey(src: string, tgt: string): string {
  const s = parseNodeId(src);
  const t = parseNodeId(tgt);
  return `${s.phase}|${s.pos}|${t.phase}|${t.pos}`;
}

function selfRegenRate(rows: RelationCandidate[]): number {
  let mismatches = 0;
  for (const r of rows) {
    if (ruleLabel(r.source, r.target) !== r.relation) {
      mismatches += 1;
    }
  }
  return 1.0 - mismatches / Math.max(rows.length, 1);
}

function triadInvariant(rows: RelationCandidate[]): boolean {
  const byFeat = new Map<string, Set<string>>();
  for (const r of rows) {
    const key = featureKey(r.source, r.target);
    if (!byFeat.has(key)) byFeat.set(key, new Set());
    byFeat.get(key)!.add(r.relation);
  }
  for (const set of byFeat.values()) {
    if (set.size !== 1) return false;
  }
  return true;
}

function subsetReconstruction(rows: RelationCandidate[]): { passed: boolean; foldsChecked: number } {
  for (let held = 1; held <= 13; held += 1) {
    const train = new Map<string, RelationLabel>();
    const test: Array<[string, RelationLabel]> = [];
    for (const r of rows) {
      const key = featureKey(r.source, r.target);
      if (r.triad_index === held) {
        test.push([key, r.relation]);
      } else {
        train.set(key, r.relation);
      }
    }
    for (const [k, lab] of test) {
      if (train.get(k) !== lab) {
        return { passed: false, foldsChecked: held };
      }
    }
  }
  return { passed: true, foldsChecked: 13 };
}

export function runInvarianceAudit(candidates: RelationCandidate[], corruptCandidateIndex?: number) {
  const regen = selfRegenRate(candidates);
  const inv = triadInvariant(candidates);
  const subset = subsetReconstruction(candidates);

  const corrupted = candidates.map((r) => ({ ...r }));
  let corruptedTarget: { index: number; source: string; target: string; original: RelationLabel } | null = null;

  if (typeof corruptCandidateIndex === 'number' && corrupted[corruptCandidateIndex]) {
    const targetRow = corrupted[corruptCandidateIndex];
    corruptedTarget = {
      index: corruptCandidateIndex,
      source: targetRow.source,
      target: targetRow.target,
      original: targetRow.relation,
    };
    targetRow.relation = targetRow.relation === 'none' ? 'mirrorOf' : 'none';
  } else {
    for (let i = 0; i < corrupted.length; i += 1) {
      if (corrupted[i].relation === 'mirrorOf') {
        corruptedTarget = {
          index: i,
          source: corrupted[i].source,
          target: corrupted[i].target,
          original: corrupted[i].relation,
        };
        corrupted[i].relation = 'none';
        break;
      }
    }
  }

  const corruptedRegen = selfRegenRate(corrupted);
  const corruptedInvariant = triadInvariant(corrupted);
  const corruptedSubset = subsetReconstruction(corrupted);
  const negativeControlDetects = corruptedRegen < 1.0;

  const autonomy = regen === 1.0 && inv && subset.passed;
  const nonTrivial = autonomy && negativeControlDetects;

  return {
    framing:
      'Invariancia no trivial: el grafo canónico regenera 1.0; un grafo con una arista corrupta debe fallar el control negativo.',
    canonical: {
      self_regeneration_rate: Number(regen.toFixed(6)),
      triad_index_invariance: inv,
      subset_reconstruction: subset.passed,
      loo_folds_checked: subset.foldsChecked,
      autonomy_measurable: autonomy,
    },
    negative_control: {
      description: corruptedTarget
        ? `Arista #${corruptedTarget.index} (${corruptedTarget.source} → ${corruptedTarget.target}) relabelada de ${corruptedTarget.original} a ${corrupted[corruptedTarget.index].relation}`
        : 'Primera arista mirrorOf relabelada a none',
      corrupted_edge: corruptedTarget,
      corrupted_self_regeneration_rate: Number(corruptedRegen.toFixed(6)),
      corrupted_triad_invariance: corruptedInvariant,
      corrupted_subset_reconstruction: corruptedSubset.passed,
      detects_corruption: negativeControlDetects,
    },
    invariance_non_trivial: nonTrivial,
  };
}

export interface AnnotationsPayload {
  description?: string;
  annotators: string[];
  annotator_profiles?: Record<string, string>;
  protocol?: string;
  status?: string;
  items: Array<{
    id: string;
    kind?: string;
    annotations: Record<string, EvalLabel | null>;
    consensus?: string;
    unanimous?: boolean;
  }>;
  disagreements?: Array<{
    id: string;
    kind: string;
    labels: Record<string, EvalLabel>;
    majority: string;
    rule_label: string;
  }>;
}

export function fleissKappa(ratings: EvalLabel[][], categories: EvalLabel[]): number | null {
  const nItems = ratings.length;
  if (nItems === 0) return null;
  const nRaters = ratings[0].length;
  if (nRaters < 2) return null;
  if (ratings.some((r) => r.length !== nRaters)) {
    throw new Error('Todas las filas de ratings deben tener la misma longitud');
  }

  const catIdx = new Map<EvalLabel, number>();
  categories.forEach((c, i) => catIdx.set(c, i));

  const table: number[][] = ratings.map((row) => {
    const counts = new Array<number>(categories.length).fill(0);
    for (const lab of row) {
      const idx = catIdx.get(lab);
      if (idx === undefined) {
        throw new Error(`Etiqueta fuera de categorías: ${lab}`);
      }
      counts[idx] += 1;
    }
    return counts;
  });

  const pPerItem = table.map((counts) => {
    const s = counts.reduce((acc, c) => acc + c * (c - 1), 0);
    return s / (nRaters * (nRaters - 1));
  });
  const pBar = pPerItem.reduce((a, b) => a + b, 0) / nItems;

  const totals = categories.map((_, j) =>
    table.reduce((acc, row) => acc + row[j], 0)
  );
  const pCats = totals.map((t) => t / (nItems * nRaters));
  const pE = pCats.reduce((acc, pj) => acc + pj * pj, 0);

  if (Math.abs(1 - pE) < 1e-12) return 1.0;
  return (pBar - pE) / (1 - pE);
}

export function loadIndependentEvalData() {
  const annotations = readJsonFile<AnnotationsPayload>('datasets/independent_eval/annotations.json');
  const ruleReference = readJsonFile<Record<string, { rule_label: string; notes: string }>>(
    'datasets/independent_eval/rule_reference.json'
  );
  const pairsCsv = fs.readFileSync(
    path.join(ROOT, 'datasets/independent_eval/instrument/pairs.csv'),
    'utf-8'
  );
  const pairs = parseCsvRows(pairsCsv);
  return { annotations, ruleReference, pairs };
}

export function scoreIndependentEval(
  annotations: AnnotationsPayload,
  ruleReference: Record<string, { rule_label: string; notes: string }>,
  minAnnotators = 3
) {
  const annotatorIds = annotations.annotators;
  const categories: EvalLabel[] = ['none', 'mirrorOf', 'creates', 'unsure'];
  const validSet = new Set<string>(categories);

  const byRespondentSet = new Map<string, { annotators: string[]; pids: string[] }>();
  const labelsByPairOrdered = new Map<string, EvalLabel[]>();
  const incompletePairs: Record<string, unknown> = {};
  const presentCounts: Record<string, number> = {};
  const unsureCountByPair: Record<string, number> = {};

  for (const item of annotations.items) {
    const respondents: string[] = [];
    const labelsOrdered: EvalLabel[] = [];
    const missing: string[] = [];

    for (const aid of annotatorIds) {
      const lab = item.annotations[aid];
      if (!lab || !validSet.has(lab)) {
        missing.push(aid);
      } else {
        respondents.push(aid);
        labelsOrdered.push(lab);
        presentCounts[lab] = (presentCounts[lab] ?? 0) + 1;
        if (lab === 'unsure') {
          unsureCountByPair[item.id] = (unsureCountByPair[item.id] ?? 0) + 1;
        }
      }
    }

    if (respondents.length === minAnnotators) {
      const key = respondents.join('|');
      if (!byRespondentSet.has(key)) {
        byRespondentSet.set(key, { annotators: respondents, pids: [] });
      }
      byRespondentSet.get(key)!.pids.push(item.id);
      labelsByPairOrdered.set(item.id, labelsOrdered);
    } else {
      incompletePairs[item.id] = {
        n_present: respondents.length,
        n_missing: missing.length,
        missing_annotators: missing,
        present_annotators: respondents,
        present_labels: labelsOrdered,
      };
    }
  }

  let bestGroup: { annotators: string[]; pids: string[] } | null = null;
  for (const group of byRespondentSet.values()) {
    if (!bestGroup || group.pids.length > bestGroup.pids.length) {
      bestGroup = group;
    }
  }

  const kappaEligibleIds = bestGroup ? [...bestGroup.pids].sort() : [];
  const nKappa = kappaEligibleIds.length;
  const ratings = kappaEligibleIds.map((pid) => labelsByPairOrdered.get(pid)!);
  const kappa = nKappa > 0 ? fleissKappa(ratings, categories) : null;

  const majority: Record<string, string> = {};
  let unanimous = 0;

  for (const pid of kappaEligibleIds) {
    const labs = labelsByPairOrdered.get(pid)!;
    const cnt = new Map<string, number>();
    for (const l of labs) cnt.set(l, (cnt.get(l) ?? 0) + 1);
    const sorted = [...cnt.entries()].sort((a, b) => b[1] - a[1]);
    const topCount = sorted[0][1];
    const tied = sorted.filter(([, c]) => c === topCount);
    majority[pid] = tied.length > 1 ? 'tie' : sorted[0][0];
    if (topCount === labs.length) unanimous += 1;
  }

  let matched = 0;
  let comparableCount = 0;
  for (const [pid, maj] of Object.entries(majority)) {
    const ref = ruleReference[pid]?.rule_label;
    if (ref && ref !== 'unspecified') {
      comparableCount += 1;
      if (ref === maj) matched += 1;
    }
  }

  return {
    status: annotations.status ?? 'completed',
    n_pairs_total: annotations.items.length,
    n_pairs_in_kappa: nKappa,
    n_pairs_incomplete: Object.keys(incompletePairs).length,
    min_annotators_required: minAnnotators,
    kappa_annotators: bestGroup?.annotators ?? [],
    fleiss_kappa: kappa === null ? null : Number(kappa.toFixed(4)),
    unanimous_count: unanimous,
    unanimous_fraction: nKappa > 0 ? Number((unanimous / nKappa).toFixed(4)) : null,
    majority_labels_in_kappa: majority,
    label_distribution_present: presentCounts,
    unsure_count_by_pair: unsureCountByPair,
    posthoc_agreement_with_rule_reference:
      comparableCount > 0 ? Number((matched / comparableCount).toFixed(4)) : null,
    n_posthoc_comparable: comparableCount,
    incomplete_detail: incompletePairs,
    policy:
      "Fleiss' kappa solo sobre ítems con exactamente k anotadores no nulos y el mismo conjunto de respondentes. No se trunca ni se rellena. null ≠ unsure.",
  };
}

export interface DomainExamplesFile {
  title: string;
  source_docs: string[];
  note: string;
  pairs: Array<{
    id: string;
    domain: string;
    source_label: string;
    target_label: string;
    perspective: string;
    phase_hint: string;
    relation: RelationLabel;
    analytic_impact: string;
    suggested_nodes: {
      source: string;
      target: string;
      note: string;
    };
  }>;
}

export function validateDomainMapping(artifacts: GeneratedArtifacts) {
  const data = readJsonFile<DomainExamplesFile>('experiments/domain_mapping/examples.json');
  const nodeMap = new Map(artifacts.nodes.map((n) => [n.node_id, n]));
  const goldMap = new Map(
    artifacts.relationCandidates.map((r) => [`${r.source}->${r.target}`, r.relation])
  );

  let ok = 0;
  let warn = 0;
  let fail = 0;

  const pairs = data.pairs.map((pair) => {
    const sid = pair.suggested_nodes.source;
    const tid = pair.suggested_nodes.target;
    const sNode = nodeMap.get(sid);
    const tNode = nodeMap.get(tid);

    if (!sNode || !tNode) {
      fail += 1;
      return {
        ...pair,
        status: 'FAIL' as const,
        gold_relation: null,
        reason: 'Nodo sugerido ausente en los 78 nodos canónicos',
      };
    }

    const actual = goldMap.get(`${sid}->${tid}`) ?? null;
    if (actual === null) {
      warn += 1;
      return {
        ...pair,
        source_node_label: sNode.label,
        target_node_label: tNode.label,
        status: 'WARN' as const,
        gold_relation: null,
        reason: 'Par no está en relation_candidates (posible cross-triad, auto-bucle o demo heurística)',
      };
    }

    if (actual === pair.relation) {
      ok += 1;
      return {
        ...pair,
        source_node_label: sNode.label,
        target_node_label: tNode.label,
        status: 'OK' as const,
        gold_relation: actual,
        reason: 'Relación propuesta coincide con el gold canónico',
      };
    }

    warn += 1;
    return {
      ...pair,
      source_node_label: sNode.label,
      target_node_label: tNode.label,
      status: 'WARN' as const,
      gold_relation: actual,
      reason: `gold=${actual} ≠ propuesto=${pair.relation} (mapeo demostrativo, no gold de dominio)`,
    };
  });

  return {
    experiment: 'EXP-E-DOMAIN-ALIGNMENT',
    title: data.title,
    note: data.note,
    ok,
    warn,
    fail,
    pairs,
  };
}

export interface QuizData {
  title: string;
  source_docs: string[];
  experiment_focus: string;
  questions: Array<{
    id: string;
    prompt: string;
    options: Record<string, string>;
    answer: string;
    rationale: string;
  }>;
  metrics_reference: Record<string, unknown>;
}

export function loadQuiz(): QuizData {
  return readJsonFile<QuizData>('experiments/learning/quiz_blind_protocol.json');
}

export function scoreQuiz(answers: Record<string, string>) {
  const quiz = loadQuiz();
  let correct = 0;
  const results = quiz.questions.map((q) => {
    const got = (answers[q.id] ?? '').toLowerCase().trim();
    const ok = got === q.answer;
    if (ok) correct += 1;
    return {
      id: q.id,
      received: got || null,
      expected: q.answer,
      ok,
      rationale: q.rationale,
    };
  });
  return {
    correct,
    total: quiz.questions.length,
    passed: correct === quiz.questions.length,
    results,
  };
}
