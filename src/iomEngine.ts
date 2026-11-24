import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  AnalysisChainColor,
  TesseractColoringChainSpec,
  TesseractColoringFamily,
  TesseractColoringSpec,
  TesseractColorMode,
} from './tesseractFlowGraph';

export type {
  AnalysisChainColor,
  TesseractColoringChainSpec,
  TesseractColoringFamily,
  TesseractColoringSpec,
  TesseractColorMode,
} from './tesseractFlowGraph';

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
        reason: 'Par no está en relation_candidates (posible cross-triad, autobucle o demo heurística)',
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

export type TesseractCubeLabel =
  | 'real'
  | 'virtual'
  | 'materia'
  | 'vacío'
  | 'individualidad'
  | 'totalidad'
  | 'evolución'
  | 'involución';

export interface TesseractRelation {
  left: string;
  arrow: '>' | '<';
  line: '_' | '...';
  right: string;
  domain: 'real' | 'virtual';
  cube: 'exterior' | 'interior';
  cubeLabel: TesseractCubeLabel;
  analysisChain: AnalysisChainColor;
  mirrorChain: AnalysisChainColor;
  parityMirrorChain: AnalysisChainColor;
  mirrorReflectedChain: AnalysisChainColor;
  chains: Record<TesseractColorMode, AnalysisChainColor>;
  notation: string;
}

export interface TesseractCell {
  id: string;
  index: number;
  row: 'superior' | 'inferior';
  col: 1 | 2 | 3 | 4;
  axisPair: string;
  exteriorLabel: TesseractCubeLabel;
  exteriorLine: '_' | '...';
  exteriorChain: AnalysisChainColor;
  exteriorMirrorChain: AnalysisChainColor;
  exteriorParityMirrorChain: AnalysisChainColor;
  exteriorMirrorReflectedChain: AnalysisChainColor;
  exteriorChains: Record<TesseractColorMode, AnalysisChainColor>;
  interiorLabel: TesseractCubeLabel;
  interiorLine: '_' | '...';
  interiorChain: AnalysisChainColor;
  interiorMirrorChain: AnalysisChainColor;
  interiorParityMirrorChain: AnalysisChainColor;
  interiorMirrorReflectedChain: AnalysisChainColor;
  interiorChains: Record<TesseractColorMode, AnalysisChainColor>;
  coords: [0 | 1, 0 | 1, 0 | 1];
  parity: 0 | 1;
  half: string;
  relations: [TesseractRelation, TesseractRelation];
  neighbors: {
    horizontal: string;
    vertical: string;
    diagonal: string;
  };
}

export interface TesseractAnalysisChainInfo {
  id: AnalysisChainColor;
  label: string;
  parity: 0 | 1;
  arrow: '>' | '<';
  domain: 'real' | 'virtual';
  cellIds: string[];
  cubeLabels: TesseractCubeLabel[];
  summary: string;
}

export interface TesseractMirrorChainInfo {
  id: AnalysisChainColor;
  label: string;
  cellIds: string[];
  cubeLabels: [TesseractCubeLabel, TesseractCubeLabel];
  modalSwap: string;
  summary: string;
}

const TESSERACT_CONCEPTS = [
  'cuerpo',
  'universo',
  'internet',
  'IA',
  'individualidad',
  'totalidad',
] as const;

const TESSERACT_CUBE_LABELS: readonly TesseractCubeLabel[] = [
  'real',
  'virtual',
  'materia',
  'vacío',
  'individualidad',
  'totalidad',
  'evolución',
  'involución',
] as const;

const CHAIN_CAPITALIZED: Record<AnalysisChainColor, string> = {
  azul: 'Azul',
  amarillo: 'Amarillo',
  rojo: 'Rojo',
  verde: 'Verde',
};

type MirrorModeId =
  | 'mirrorReflected'
  | 'mirror'
  | 'mirrorFrameSwap'
  | 'mirrorFrameSwapMirror'
  | 'mirrorSetTop'
  | 'mirrorSetTopMirror';
type ParityModeId =
  | 'parityPolarMirror'
  | 'parityPolarSwap'
  | 'paritySetTop'
  | 'paritySetBottom'
  | 'parityMirror'
  | 'parity';

const MIRROR_COLOR_ASSIGNMENTS: Record<
  MirrorModeId,
  Record<'realInvol' | 'virtualEvol' | 'vacioIndiv' | 'materiaTot', AnalysisChainColor>
> = {
  mirrorReflected: {
    realInvol: 'rojo',
    virtualEvol: 'verde',
    vacioIndiv: 'amarillo',
    materiaTot: 'azul',
  },
  mirror: {
    realInvol: 'azul',
    virtualEvol: 'amarillo',
    vacioIndiv: 'verde',
    materiaTot: 'rojo',
  },
  mirrorFrameSwap: {
    realInvol: 'amarillo',
    virtualEvol: 'azul',
    vacioIndiv: 'verde',
    materiaTot: 'rojo',
  },
  mirrorFrameSwapMirror: {
    realInvol: 'verde',
    virtualEvol: 'rojo',
    vacioIndiv: 'amarillo',
    materiaTot: 'azul',
  },
  mirrorSetTop: {
    realInvol: 'rojo',
    virtualEvol: 'verde',
    vacioIndiv: 'azul',
    materiaTot: 'amarillo',
  },
  mirrorSetTopMirror: {
    realInvol: 'azul',
    virtualEvol: 'amarillo',
    vacioIndiv: 'rojo',
    materiaTot: 'verde',
  },
};

const PARITY_COLOR_ASSIGNMENTS: Record<
  ParityModeId,
  {
    p0Right: AnalysisChainColor;
    p0Left: AnalysisChainColor;
    p1Left: AnalysisChainColor;
    p1Right: AnalysisChainColor;
  }
> = {
  parityPolarMirror: {
    p0Right: 'rojo',
    p0Left: 'verde',
    p1Left: 'amarillo',
    p1Right: 'azul',
  },
  parityPolarSwap: {
    p0Right: 'amarillo',
    p0Left: 'azul',
    p1Left: 'rojo',
    p1Right: 'verde',
  },
  paritySetTop: {
    p0Right: 'verde',
    p0Left: 'rojo',
    p1Left: 'amarillo',
    p1Right: 'azul',
  },
  paritySetBottom: {
    p0Right: 'amarillo',
    p0Left: 'azul',
    p1Left: 'verde',
    p1Right: 'rojo',
  },
  parityMirror: {
    p0Right: 'rojo',
    p0Left: 'verde',
    p1Left: 'azul',
    p1Right: 'amarillo',
  },
  parity: {
    p0Right: 'azul',
    p0Left: 'amarillo',
    p1Left: 'rojo',
    p1Right: 'verde',
  },
};

const INVOLUTION_BLUE_RED_YELLOW_GREEN: Record<AnalysisChainColor, AnalysisChainColor> = {
  azul: 'rojo',
  rojo: 'azul',
  amarillo: 'verde',
  verde: 'amarillo',
};

const INVOLUTION_YELLOW_RED_BLUE_GREEN: Record<AnalysisChainColor, AnalysisChainColor> = {
  amarillo: 'rojo',
  rojo: 'amarillo',
  azul: 'verde',
  verde: 'azul',
};

interface ColoringDefinition {
  id: TesseractColorMode;
  shortLabel: string;
  title: string;
  family: TesseractColoringFamily;
  assetPath: string;
  assetTag: string;
  mirrorPartnerId: TesseractColorMode;
  mirrorPartnerLabel: string;
  involutionRule: string;
  involutionMap: Record<AnalysisChainColor, AnalysisChainColor>;
  summary: string;
  filterHint: string;
}

const COLORING_DEFINITIONS: readonly ColoringDefinition[] = [
  {
    id: 'mirrorReflected',
    shortLabel: 'Espejado 2ª img (IMG-031910)',
    title: 'Espejado de 2ª imagen (Marcos: Rojo/Verde · Amarillo/Azul)',
    family: 'mirror',
    assetPath: '/assets/aistudio/IMG_20261123_031910_595b8f79.jpg',
    assetTag: 'IMG-031910',
    mirrorPartnerId: 'mirror',
    mirrorPartnerLabel: 'TSRIMG',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Espejado exacto de TSRIMG sobre marcos ({T1↔T4, T6↔T7} en Rojo/Verde; {T2↔T3, T5↔T8} en Amarillo/Azul): anverso y reverso sin generar un afuera.',
    filterHint: 'espejado 2ª imagen (IMG-031910)',
  },
  {
    id: 'mirror',
    shortLabel: 'Espejeo marcos (TSRIMG)',
    title: 'Espejeo interno de marcos (Azul/Amarillo · Verde/Rojo)',
    family: 'mirror',
    assetPath: '/assets/aistudio/TSRIMG_20261123_023812_55e05147.jpg',
    assetTag: 'TSRIMG',
    mirrorPartnerId: 'mirrorReflected',
    mirrorPartnerLabel: 'IMG-031910',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Revela la reflexión especular entre cuadrantes por pares de marcos ({T1↔T4, T6↔T7} en Azul/Amarillo; {T2↔T3, T5↔T8} en Verde/Rojo).',
    filterHint: 'espejeo marcos (TSRIMG)',
  },
  {
    id: 'mirrorFrameSwap',
    shortLabel: 'Cruce marcos (IMG-063146)',
    title: 'Permutación de marcos (Amarillo/Azul · Verde/Rojo)',
    family: 'mirror',
    assetPath: '/assets/aistudio/IMG_20261123_063146_8d038bdc.jpg',
    assetTag: 'IMG-063146',
    mirrorPartnerId: 'mirrorFrameSwapMirror',
    mirrorPartnerLabel: 'IMG-000207 #7',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Marcos {T1↔T4, T6↔T7} en Amarillo/Azul y {T2↔T3, T5↔T8} en Verde/Rojo (panel #5 de IMG-000207); su reflejo exacto es el panel #7 bajo Azul ↔ Rojo y Amarillo ↔ Verde.',
    filterHint: 'cruce marcos (IMG-063146)',
  },
  {
    id: 'mirrorFrameSwapMirror',
    shortLabel: 'Cruce inverso (IMG-000207 #7)',
    title: 'Reflejo de cruce de marcos (Verde/Rojo · Amarillo/Azul)',
    family: 'mirror',
    assetPath: '/assets/aistudio/IMG_20261124_000207_382065f8.jpg',
    assetTag: 'IMG-000207 #7',
    mirrorPartnerId: 'mirrorFrameSwap',
    mirrorPartnerLabel: 'IMG-063146 (#5)',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Panel #7 de IMG-000207: invierte exactamente IMG-063146 (#5) bajo Azul ↔ Rojo y Amarillo ↔ Verde ({T1↔T4, T6↔T7} en Verde/Rojo; {T2↔T3, T5↔T8} en Amarillo/Azul).',
    filterHint: 'cruce inverso (IMG-000207 #7)',
  },
  {
    id: 'mirrorSetTop',
    shortLabel: 'Marcos conjunto A (#1)',
    title: 'Conjunto maestro de marcos A (Rojo/Verde · Azul/Amarillo)',
    family: 'mirror',
    assetPath: '/assets/aistudio/IMG_20261124_000207_382065f8.jpg',
    assetTag: 'IMG-000207 #1',
    mirrorPartnerId: 'mirrorSetTopMirror',
    mirrorPartnerLabel: 'IMG-000207 #3',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Panel #1 de IMG-000207: {T1↔T4, T6↔T7} en Rojo/Verde y {T2↔T3, T5↔T8} en Azul/Amarillo; su reflejo horizontal exacto es el panel #3.',
    filterHint: 'marcos conjunto A (IMG-000207 #1)',
  },
  {
    id: 'mirrorSetTopMirror',
    shortLabel: 'Marcos conjunto B (#3)',
    title: 'Conjunto maestro de marcos B (Azul/Amarillo · Rojo/Verde)',
    family: 'mirror',
    assetPath: '/assets/aistudio/IMG_20261124_000207_382065f8.jpg',
    assetTag: 'IMG-000207 #3',
    mirrorPartnerId: 'mirrorSetTop',
    mirrorPartnerLabel: 'IMG-000207 #1',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Panel #3 de IMG-000207: reflejo exacto del panel #1 bajo Azul ↔ Rojo y Amarillo ↔ Verde ({T1↔T4, T6↔T7} en Azul/Amarillo; {T2↔T3, T5↔T8} en Rojo/Verde).',
    filterHint: 'marcos conjunto B (IMG-000207 #3)',
  },
  {
    id: 'parityPolarMirror',
    shortLabel: 'Espejeo polar (IMG-070052)',
    title: 'Clausura polar por paridad (Rojo/Verde · Amarillo/Azul)',
    family: 'parity',
    assetPath: '/assets/aistudio/IMG_20261123_070052_2e86be46.jpg',
    assetTag: 'IMG-070052',
    mirrorPartnerId: 'parityPolarSwap',
    mirrorPartnerLabel: 'IMG-064557',
    involutionRule: 'Amarillo ↔ Rojo · Azul ↔ Verde',
    involutionMap: INVOLUTION_YELLOW_RED_BLUE_GREEN,
    summary:
      'Empareja P0 {T1,T3,T6,T8} (Rojo › / Verde ‹) con P1 {T2,T4,T5,T7} (Amarillo ‹ / Azul ›); refleja exactamente IMG-064557 por Amarillo ↔ Rojo y Azul ↔ Verde.',
    filterHint: 'espejeo polar paridad (IMG-070052)',
  },
  {
    id: 'parityPolarSwap',
    shortLabel: 'Alterno polar (IMG-064557)',
    title: 'Espejeo alterno por paridad (Amarillo/Azul · Rojo/Verde)',
    family: 'parity',
    assetPath: '/assets/aistudio/IMG_20261123_064557_52d8695d.jpg',
    assetTag: 'IMG-064557',
    mirrorPartnerId: 'parityPolarMirror',
    mirrorPartnerLabel: 'IMG-070052',
    involutionRule: 'Amarillo ↔ Rojo · Azul ↔ Verde',
    involutionMap: INVOLUTION_YELLOW_RED_BLUE_GREEN,
    summary:
      'Asignación recíproca de P0 {T1,T3,T6,T8} (Amarillo › / Azul ‹) y P1 {T2,T4,T5,T7} (Rojo ‹ / Verde ›); su reflejo exacto reproduce IMG-070052.',
    filterHint: 'alterno polar paridad (IMG-064557)',
  },
  {
    id: 'paritySetTop',
    shortLabel: 'Paridad conjunto A (#2)',
    title: 'Conjunto maestro por paridad A (Verde/Rojo · Amarillo/Azul)',
    family: 'parity',
    assetPath: '/assets/aistudio/IMG_20261124_000207_382065f8.jpg',
    assetTag: 'IMG-000207 #2',
    mirrorPartnerId: 'paritySetBottom',
    mirrorPartnerLabel: 'IMG-000207 #6',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Panel #2 de IMG-000207: P0 {T1,T3,T6,T8} en Verde › / Rojo ‹ y P1 {T2,T4,T5,T7} en Amarillo ‹ / Azul ›; cierra exactamente en el panel #6.',
    filterHint: 'paridad conjunto A (IMG-000207 #2)',
  },
  {
    id: 'paritySetBottom',
    shortLabel: 'Paridad conjunto B (#6)',
    title: 'Conjunto maestro por paridad B (Amarillo/Azul · Verde/Rojo)',
    family: 'parity',
    assetPath: '/assets/aistudio/IMG_20261124_000207_382065f8.jpg',
    assetTag: 'IMG-000207 #6',
    mirrorPartnerId: 'paritySetTop',
    mirrorPartnerLabel: 'IMG-000207 #2',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Panel #6 de IMG-000207: reflejo exacto del panel #2 bajo Azul ↔ Rojo y Amarillo ↔ Verde (P0 en Amarillo › / Azul ‹; P1 en Verde ‹ / Rojo ›).',
    filterHint: 'paridad conjunto B (IMG-000207 #6)',
  },
  {
    id: 'parityMirror',
    shortLabel: 'Espejeo paridad (IMG-025743)',
    title: 'Espejeo por paridad (Rojo/Verde · Azul/Amarillo)',
    family: 'parity',
    assetPath: '/assets/aistudio/IMG_20261123_025743_a2265a38.jpg',
    assetTag: 'IMG-025743',
    mirrorPartnerId: 'parity',
    mirrorPartnerLabel: 'IMG-015713',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Reflejo especular de IMG-015713 (panel #8 de IMG-000207): P0 {T1,T3,T6,T8} en Rojo › / Verde ‹ y P1 {T2,T4,T5,T7} en Azul ‹ / Amarillo ›.',
    filterHint: 'espejeo paridad (IMG-025743)',
  },
  {
    id: 'parity',
    shortLabel: 'Cadenas paridad (IMG-015713)',
    title: 'Cadenas base por paridad (Azul/Amarillo · Rojo/Verde)',
    family: 'parity',
    assetPath: '/assets/aistudio/IMG_20261123_015713_b7332827.jpg',
    assetTag: 'IMG-015713',
    mirrorPartnerId: 'parityMirror',
    mirrorPartnerLabel: 'IMG-025743',
    involutionRule: 'Azul ↔ Rojo · Amarillo ↔ Verde',
    involutionMap: INVOLUTION_BLUE_RED_YELLOW_GREEN,
    summary:
      'Coloración base de análisis por paridad (panel #4 de IMG-000207): P0 {T1,T3,T6,T8} en Azul › / Amarillo ‹ y P1 {T2,T4,T5,T7} en Rojo ‹ / Verde ›.',
    filterHint: 'cadenas por paridad (IMG-015713)',
  },
] as const;

function buildMirrorChainSpecs(
  mode: MirrorModeId,
  partnerMap: Record<AnalysisChainColor, AnalysisChainColor>,
  partnerTag: string,
  showPartnerParen: boolean
): TesseractColoringChainSpec[] {
  const assign = MIRROR_COLOR_ASSIGNMENTS[mode];
  const fmtLabel = (c: AnalysisChainColor) =>
    showPartnerParen
      ? `${CHAIN_CAPITALIZED[c]} (↔ ${CHAIN_CAPITALIZED[partnerMap[c]]})`
      : CHAIN_CAPITALIZED[c];
  return [
    {
      id: assign.realInvol,
      label: fmtLabel(assign.realInvol),
      cellIds: ['T1', 'T4', 'T6', 'T7'],
      cubeLabels: ['real', 'involución'],
      modalSwap: 'real (ext _) ↔ involución (int ...)',
      summary: `${partnerTag} {T1↔T4, T6↔T7} · real ext _ ↔ involución int ... · 2 › / 2 ‹`,
    },
    {
      id: assign.virtualEvol,
      label: fmtLabel(assign.virtualEvol),
      cellIds: ['T1', 'T4', 'T6', 'T7'],
      cubeLabels: ['virtual', 'evolución'],
      modalSwap: 'virtual (int ...) ↔ evolución (ext _)',
      summary: `${partnerTag} {T1↔T4, T6↔T7} · virtual int ... ↔ evolución ext _ · 2 ‹ / 2 ›`,
    },
    {
      id: assign.vacioIndiv,
      label: fmtLabel(assign.vacioIndiv),
      cellIds: ['T2', 'T3', 'T5', 'T8'],
      cubeLabels: ['vacío', 'individualidad'],
      modalSwap: 'vacío (ext ...) ↔ individualidad (int _)',
      summary: `${partnerTag} {T2↔T3, T5↔T8} · vacío ext ... ↔ individualidad int _ · 2 ‹ / 2 ›`,
    },
    {
      id: assign.materiaTot,
      label: fmtLabel(assign.materiaTot),
      cellIds: ['T2', 'T3', 'T5', 'T8'],
      cubeLabels: ['materia', 'totalidad'],
      modalSwap: 'materia (int _) ↔ totalidad (ext ...)',
      summary: `${partnerTag} {T2↔T3, T5↔T8} · materia int _ ↔ totalidad ext ... · 2 › / 2 ‹`,
    },
  ];
}

function buildParityChainSpecs(
  mode: ParityModeId,
  partnerMap: Record<AnalysisChainColor, AnalysisChainColor>,
  showPartnerParen: boolean
): TesseractColoringChainSpec[] {
  const assign = PARITY_COLOR_ASSIGNMENTS[mode];
  const fmtLabel = (c: AnalysisChainColor) =>
    showPartnerParen
      ? `${CHAIN_CAPITALIZED[c]} (↔ ${CHAIN_CAPITALIZED[partnerMap[c]]})`
      : CHAIN_CAPITALIZED[c];
  return [
    {
      id: assign.p0Right,
      label: fmtLabel(assign.p0Right),
      parity: 0,
      arrow: '>',
      domain: 'real',
      cellIds: ['T1', 'T3', 'T6', 'T8'],
      cubeLabels: ['real', 'vacío', 'involución', 'individualidad'],
      summary: 'Paridad par {T1, T3, T6, T8} · flujo directo › · real/vacío/involución/individualidad',
    },
    {
      id: assign.p0Left,
      label: fmtLabel(assign.p0Left),
      parity: 0,
      arrow: '<',
      domain: 'virtual',
      cellIds: ['T1', 'T3', 'T6', 'T8'],
      cubeLabels: ['virtual', 'materia', 'evolución', 'totalidad'],
      summary: 'Paridad par {T1, T3, T6, T8} · flujo inverso ‹ · virtual/materia/evolución/totalidad',
    },
    {
      id: assign.p1Left,
      label: fmtLabel(assign.p1Left),
      parity: 1,
      arrow: '<',
      domain: 'virtual',
      cellIds: ['T2', 'T4', 'T5', 'T7'],
      cubeLabels: ['vacío', 'real', 'individualidad', 'involución'],
      summary: 'Paridad impar {T2, T4, T5, T7} · flujo inverso ‹ · vacío/real/individualidad/involución',
    },
    {
      id: assign.p1Right,
      label: fmtLabel(assign.p1Right),
      parity: 1,
      arrow: '>',
      domain: 'real',
      cellIds: ['T2', 'T4', 'T5', 'T7'],
      cubeLabels: ['materia', 'virtual', 'totalidad', 'evolución'],
      summary: 'Paridad impar {T2, T4, T5, T7} · flujo directo › · materia/virtual/totalidad/evolución',
    },
  ];
}

const ANALYSIS_CHAINS_INFO: readonly TesseractAnalysisChainInfo[] = buildParityChainSpecs(
  'parity',
  INVOLUTION_BLUE_RED_YELLOW_GREEN,
  false
).map((c) => ({
  id: c.id,
  label: c.label,
  parity: c.parity!,
  arrow: c.arrow!,
  domain: c.domain!,
  cellIds: c.cellIds,
  cubeLabels: c.cubeLabels as TesseractCubeLabel[],
  summary: c.summary,
}));

const PARITY_MIRROR_CHAINS_INFO: readonly TesseractAnalysisChainInfo[] = buildParityChainSpecs(
  'parityMirror',
  INVOLUTION_BLUE_RED_YELLOW_GREEN,
  true
).map((c) => ({
  id: c.id,
  label: c.label,
  parity: c.parity!,
  arrow: c.arrow!,
  domain: c.domain!,
  cellIds: c.cellIds,
  cubeLabels: c.cubeLabels as TesseractCubeLabel[],
  summary: c.summary,
}));

const MIRROR_CHAINS_INFO: readonly TesseractMirrorChainInfo[] = buildMirrorChainSpecs(
  'mirror',
  INVOLUTION_BLUE_RED_YELLOW_GREEN,
  'Espejeo horizontal',
  false
).map((c) => ({
  id: c.id,
  label: c.label,
  cellIds: c.cellIds,
  cubeLabels: c.cubeLabels as [TesseractCubeLabel, TesseractCubeLabel],
  modalSwap: c.modalSwap!,
  summary: c.summary,
}));

const MIRROR_REFLECTED_CHAINS_INFO: readonly TesseractMirrorChainInfo[] = buildMirrorChainSpecs(
  'mirrorReflected',
  INVOLUTION_BLUE_RED_YELLOW_GREEN,
  'Espejado TSRIMG',
  true
).map((c) => ({
  id: c.id,
  label: c.label,
  cellIds: c.cellIds,
  cubeLabels: c.cubeLabels as [TesseractCubeLabel, TesseractCubeLabel],
  modalSwap: c.modalSwap!,
  summary: c.summary,
}));

export function buildTesseractModel() {
  const resolveParityColor = (
    mode: ParityModeId,
    parity: 0 | 1,
    arrow: '>' | '<'
  ): AnalysisChainColor => {
    const spec = PARITY_COLOR_ASSIGNMENTS[mode];
    if (parity === 0) return arrow === '>' ? spec.p0Right : spec.p0Left;
    return arrow === '<' ? spec.p1Left : spec.p1Right;
  };

  const resolveMirrorColor = (
    mode: MirrorModeId,
    cubeLabel: TesseractCubeLabel
  ): AnalysisChainColor => {
    const spec = MIRROR_COLOR_ASSIGNMENTS[mode];
    if (cubeLabel === 'real' || cubeLabel === 'involución') return spec.realInvol;
    if (cubeLabel === 'virtual' || cubeLabel === 'evolución') return spec.virtualEvol;
    if (cubeLabel === 'vacío' || cubeLabel === 'individualidad') return spec.vacioIndiv;
    return spec.materiaTot;
  };

  const mkRel = (
    parity: 0 | 1,
    left: string,
    arrow: '>' | '<',
    line: '_' | '...',
    right: string,
    cube: 'exterior' | 'interior',
    cubeLabel: TesseractCubeLabel
  ): TesseractRelation => {
    const chains: Record<TesseractColorMode, AnalysisChainColor> = {
      mirrorReflected: resolveMirrorColor('mirrorReflected', cubeLabel),
      mirror: resolveMirrorColor('mirror', cubeLabel),
      mirrorFrameSwap: resolveMirrorColor('mirrorFrameSwap', cubeLabel),
      mirrorFrameSwapMirror: resolveMirrorColor('mirrorFrameSwapMirror', cubeLabel),
      mirrorSetTop: resolveMirrorColor('mirrorSetTop', cubeLabel),
      mirrorSetTopMirror: resolveMirrorColor('mirrorSetTopMirror', cubeLabel),
      parityPolarMirror: resolveParityColor('parityPolarMirror', parity, arrow),
      parityPolarSwap: resolveParityColor('parityPolarSwap', parity, arrow),
      paritySetTop: resolveParityColor('paritySetTop', parity, arrow),
      paritySetBottom: resolveParityColor('paritySetBottom', parity, arrow),
      parityMirror: resolveParityColor('parityMirror', parity, arrow),
      parity: resolveParityColor('parity', parity, arrow),
    };
    return {
      left,
      arrow,
      line,
      right,
      domain: arrow === '>' ? 'real' : 'virtual',
      cube,
      cubeLabel,
      analysisChain: chains.parity,
      mirrorChain: chains.mirror,
      parityMirrorChain: chains.parityMirror,
      mirrorReflectedChain: chains.mirrorReflected,
      chains,
      notation: `${left} ${arrow} ${line} ${arrow} ${right}`,
    };
  };

  const mkCell = (spec: {
    id: string;
    index: number;
    row: 'superior' | 'inferior';
    col: 1 | 2 | 3 | 4;
    axisPair: string;
    exteriorLabel: TesseractCubeLabel;
    exteriorLine: '_' | '...';
    interiorLabel: TesseractCubeLabel;
    interiorLine: '_' | '...';
    coords: [0 | 1, 0 | 1, 0 | 1];
    parity: 0 | 1;
    half: string;
    relations: [TesseractRelation, TesseractRelation];
    neighbors: { horizontal: string; vertical: string; diagonal: string };
  }): TesseractCell => {
    const extRel = spec.relations.find((r) => r.cube === 'exterior')!;
    const intRel = spec.relations.find((r) => r.cube === 'interior')!;
    return {
      ...spec,
      exteriorChain: extRel.chains.parity,
      exteriorMirrorChain: extRel.chains.mirror,
      exteriorParityMirrorChain: extRel.chains.parityMirror,
      exteriorMirrorReflectedChain: extRel.chains.mirrorReflected,
      exteriorChains: { ...extRel.chains },
      interiorChain: intRel.chains.parity,
      interiorMirrorChain: intRel.chains.mirror,
      interiorParityMirrorChain: intRel.chains.parityMirror,
      interiorMirrorReflectedChain: intRel.chains.mirrorReflected,
      interiorChains: { ...intRel.chains },
    };
  };

  const cells: TesseractCell[] = [
    mkCell({
      id: 'T1',
      index: 1,
      row: 'superior',
      col: 1,
      axisPair: 'real / virtual',
      exteriorLabel: 'real',
      exteriorLine: '_',
      interiorLabel: 'virtual',
      interiorLine: '...',
      coords: [0, 0, 0],
      parity: 0,
      half: 'Parte superior · #1',
      relations: [
        mkRel(0, 'cuerpo', '>', '_', 'universo', 'exterior', 'real'),
        mkRel(0, 'internet', '<', '...', 'IA', 'interior', 'virtual'),
      ],
      neighbors: { horizontal: 'T4', vertical: 'T5', diagonal: 'T8' },
    }),
    mkCell({
      id: 'T2',
      index: 2,
      row: 'superior',
      col: 2,
      axisPair: 'materia / vacío',
      exteriorLabel: 'vacío',
      exteriorLine: '...',
      interiorLabel: 'materia',
      interiorLine: '_',
      coords: [0, 1, 0],
      parity: 1,
      half: 'Parte superior · #2',
      relations: [
        mkRel(1, 'individualidad', '<', '...', 'totalidad', 'exterior', 'vacío'),
        mkRel(1, 'totalidad', '>', '_', 'individualidad', 'interior', 'materia'),
      ],
      neighbors: { horizontal: 'T3', vertical: 'T6', diagonal: 'T7' },
    }),
    mkCell({
      id: 'T3',
      index: 3,
      row: 'superior',
      col: 3,
      axisPair: 'materia / vacío',
      exteriorLabel: 'vacío',
      exteriorLine: '...',
      interiorLabel: 'materia',
      interiorLine: '_',
      coords: [0, 1, 1],
      parity: 0,
      half: 'Parte superior · #3',
      relations: [
        mkRel(0, 'totalidad', '>', '...', 'individualidad', 'exterior', 'vacío'),
        mkRel(0, 'individualidad', '<', '_', 'totalidad', 'interior', 'materia'),
      ],
      neighbors: { horizontal: 'T2', vertical: 'T7', diagonal: 'T6' },
    }),
    mkCell({
      id: 'T4',
      index: 4,
      row: 'superior',
      col: 4,
      axisPair: 'real / virtual',
      exteriorLabel: 'real',
      exteriorLine: '_',
      interiorLabel: 'virtual',
      interiorLine: '...',
      coords: [0, 0, 1],
      parity: 1,
      half: 'Parte superior · #4',
      relations: [
        mkRel(1, 'universo', '<', '_', 'cuerpo', 'exterior', 'real'),
        mkRel(1, 'IA', '>', '...', 'internet', 'interior', 'virtual'),
      ],
      neighbors: { horizontal: 'T1', vertical: 'T8', diagonal: 'T5' },
    }),
    mkCell({
      id: 'T5',
      index: 5,
      row: 'inferior',
      col: 1,
      axisPair: 'individualidad / totalidad',
      exteriorLabel: 'totalidad',
      exteriorLine: '...',
      interiorLabel: 'individualidad',
      interiorLine: '_',
      coords: [1, 0, 0],
      parity: 1,
      half: 'Parte inferior · #1',
      relations: [
        mkRel(1, 'cuerpo', '<', '_', 'universo', 'interior', 'individualidad'),
        mkRel(1, 'internet', '>', '...', 'IA', 'exterior', 'totalidad'),
      ],
      neighbors: { horizontal: 'T8', vertical: 'T1', diagonal: 'T4' },
    }),
    mkCell({
      id: 'T6',
      index: 6,
      row: 'inferior',
      col: 2,
      axisPair: 'evolución / involución',
      exteriorLabel: 'evolución',
      exteriorLine: '_',
      interiorLabel: 'involución',
      interiorLine: '...',
      coords: [1, 1, 0],
      parity: 0,
      half: 'Parte inferior · #2',
      relations: [
        mkRel(0, 'individualidad', '>', '...', 'totalidad', 'interior', 'involución'),
        mkRel(0, 'totalidad', '<', '_', 'individualidad', 'exterior', 'evolución'),
      ],
      neighbors: { horizontal: 'T7', vertical: 'T2', diagonal: 'T3' },
    }),
    mkCell({
      id: 'T7',
      index: 7,
      row: 'inferior',
      col: 3,
      axisPair: 'evolución / involución',
      exteriorLabel: 'evolución',
      exteriorLine: '_',
      interiorLabel: 'involución',
      interiorLine: '...',
      coords: [1, 1, 1],
      parity: 1,
      half: 'Parte inferior · #3',
      relations: [
        mkRel(1, 'totalidad', '<', '...', 'individualidad', 'interior', 'involución'),
        mkRel(1, 'individualidad', '>', '_', 'totalidad', 'exterior', 'evolución'),
      ],
      neighbors: { horizontal: 'T6', vertical: 'T3', diagonal: 'T2' },
    }),
    mkCell({
      id: 'T8',
      index: 8,
      row: 'inferior',
      col: 4,
      axisPair: 'individualidad / totalidad',
      exteriorLabel: 'totalidad',
      exteriorLine: '...',
      interiorLabel: 'individualidad',
      interiorLine: '_',
      coords: [1, 0, 1],
      parity: 0,
      half: 'Parte inferior · #4',
      relations: [
        mkRel(0, 'universo', '>', '_', 'cuerpo', 'interior', 'individualidad'),
        mkRel(0, 'IA', '<', '...', 'internet', 'exterior', 'totalidad'),
      ],
      neighbors: { horizontal: 'T5', vertical: 'T4', diagonal: 'T1' },
    }),
  ];

  const allRealUseRightArrow = cells.every((c) =>
    c.relations.every((r) => (r.domain === 'real' ? r.arrow === '>' : r.arrow === '<'))
  );
  const allHaveOneRealOneVirtual = cells.every(
    (c) =>
      c.relations.filter((r) => r.domain === 'real').length === 1 &&
      c.relations.filter((r) => r.domain === 'virtual').length === 1
  );
  const allHaveOneContinuousOneDashed = cells.every(
    (c) =>
      c.exteriorLine !== c.interiorLine &&
      c.relations.filter((r) => r.line === '_').length === 1 &&
      c.relations.filter((r) => r.line === '...').length === 1
  );
  const allCubeLinesMatchHeader = cells.every((c) => {
    const extRel = c.relations.find((r) => r.cube === 'exterior');
    const intRel = c.relations.find((r) => r.cube === 'interior');
    if (!extRel || !intRel) return false;
    const allModesDistinct = COLORING_DEFINITIONS.every(
      (def) => c.exteriorChains[def.id] !== c.interiorChains[def.id]
    );
    return (
      c.exteriorLine !== c.interiorLine &&
      c.exteriorLabel !== c.interiorLabel &&
      c.exteriorChain !== c.interiorChain &&
      c.exteriorMirrorChain !== c.interiorMirrorChain &&
      c.exteriorParityMirrorChain !== c.interiorParityMirrorChain &&
      c.exteriorMirrorReflectedChain !== c.interiorMirrorReflectedChain &&
      allModesDistinct &&
      extRel.cubeLabel === c.exteriorLabel &&
      extRel.line === c.exteriorLine &&
      COLORING_DEFINITIONS.every((def) => extRel.chains[def.id] === c.exteriorChains[def.id]) &&
      intRel.cubeLabel === c.interiorLabel &&
      intRel.line === c.interiorLine &&
      COLORING_DEFINITIONS.every((def) => intRel.chains[def.id] === c.interiorChains[def.id])
    );
  });
  const realArrowCount = cells.reduce(
    (acc, c) => acc + c.relations.filter((r) => r.arrow === '>').length,
    0
  );
  const virtualArrowCount = cells.reduce(
    (acc, c) => acc + c.relations.filter((r) => r.arrow === '<').length,
    0
  );
  const continuousExtCount = cells.filter((c) => c.exteriorLine === '_').length;
  const dashedExtCount = cells.filter((c) => c.exteriorLine === '...').length;

  const cellById = new Map(cells.map((c) => [c.id, c]));

  const isMirrorColoringBalanced = (
    mode: MirrorModeId,
    chains: TesseractColoringChainSpec[]
  ): boolean =>
    chains.length === 4 &&
    chains.every((mirror) => {
      const mirrorRels = cells.flatMap((c) =>
        c.relations.filter((r) => r.chains[mode] === mirror.id).map((r) => ({ cell: c, rel: r }))
      );
      if (mirrorRels.length !== 4) return false;
      const cellIdsMatch = mirrorRels.map((x) => x.cell.id).join(',') === mirror.cellIds.join(',');
      const labels = new Set(mirrorRels.map((x) => x.rel.cubeLabel));
      const rightCount = mirrorRels.filter((x) => x.rel.arrow === '>').length;
      const leftCount = mirrorRels.filter((x) => x.rel.arrow === '<').length;
      const extCount = mirrorRels.filter((x) => x.rel.cube === 'exterior').length;
      const intCount = mirrorRels.filter((x) => x.rel.cube === 'interior').length;
      const solidCount = mirrorRels.filter((x) => x.rel.line === '_').length;
      const dashedCount = mirrorRels.filter((x) => x.rel.line === '...').length;
      const horizPreserved = mirrorRels.every((x) => {
        const horiz = cellById.get(x.cell.neighbors.horizontal);
        return Boolean(
          horiz?.relations.some(
            (hr) =>
              hr.chains[mode] === mirror.id &&
              hr.cubeLabel === x.rel.cubeLabel &&
              hr.arrow !== x.rel.arrow
          )
        );
      });
      return (
        cellIdsMatch &&
        labels.size === 2 &&
        mirror.cubeLabels.every((lab) => labels.has(lab as TesseractCubeLabel)) &&
        rightCount === 2 &&
        leftCount === 2 &&
        extCount === 2 &&
        intCount === 2 &&
        solidCount === 2 &&
        dashedCount === 2 &&
        horizPreserved
      );
    });

  const isParityColoringBalanced = (
    mode: ParityModeId,
    chains: TesseractColoringChainSpec[]
  ): boolean =>
    chains.length === 4 &&
    chains.every((chain) => {
      const chainRels = cells.flatMap((c) =>
        c.relations.filter((r) => r.chains[mode] === chain.id).map((r) => ({ cell: c, rel: r }))
      );
      if (chainRels.length !== 4) return false;
      const cellIdsMatch = chainRels.map((x) => x.cell.id).join(',') === chain.cellIds.join(',');
      const combos = new Set(chainRels.map((x) => `${x.rel.cube}:${x.rel.line}`));
      const labels = new Set(chainRels.map((x) => x.rel.cubeLabel));
      const sameArrow = chainRels.every((x) => x.rel.arrow === chain.arrow);
      const horizOpposite = chainRels.every((x) => {
        const horiz = cellById.get(x.cell.neighbors.horizontal);
        return Boolean(
          horiz?.relations.some(
            (hr) => hr.cubeLabel === x.rel.cubeLabel && hr.arrow !== x.rel.arrow
          )
        );
      });
      return (
        cellIdsMatch &&
        combos.size === 4 &&
        chain.cubeLabels.every((lab) => labels.has(lab as TesseractCubeLabel)) &&
        sameArrow &&
        horizOpposite
      );
    });

  const colorings: TesseractColoringSpec[] = COLORING_DEFINITIONS.map((def) => {
    const showParen = def.id === 'mirrorReflected' || def.id === 'parityMirror';
    const chains =
      def.family === 'mirror'
        ? buildMirrorChainSpecs(
            def.id as MirrorModeId,
            def.involutionMap,
            def.id === 'mirrorReflected' ? 'Espejado TSRIMG' : 'Espejeo horizontal',
            showParen
          )
        : buildParityChainSpecs(def.id as ParityModeId, def.involutionMap, showParen);
    const balanced =
      def.family === 'mirror'
        ? isMirrorColoringBalanced(def.id as MirrorModeId, chains)
        : isParityColoringBalanced(def.id as ParityModeId, chains);

    return {
      ...def,
      chains,
      balanced,
    };
  });

  const byMode = new Map(colorings.map((c) => [c.id, c]));

  const allColoringInvolutionsExact = colorings.every((coloring) => {
    const partner = byMode.get(coloring.mirrorPartnerId);
    if (!partner || partner.mirrorPartnerId !== coloring.id) return false;
    return cells.every((cell) =>
      cell.relations.every((rel) => {
        const mapped = coloring.involutionMap[rel.chains[coloring.id]];
        const partnerColor = rel.chains[coloring.mirrorPartnerId];
        return mapped === partnerColor;
      })
    );
  });

  const allAnalysisChainsBalanced = Boolean(byMode.get('parity')?.balanced);
  const allParityMirrorChainsBalanced = Boolean(byMode.get('parityMirror')?.balanced);
  const allMirrorChainsBalanced = Boolean(byMode.get('mirror')?.balanced);
  const allMirrorReflectedChainsBalanced = Boolean(byMode.get('mirrorReflected')?.balanced);
  const allColoringsClosed =
    colorings.length === 12 &&
    allCubeLinesMatchHeader &&
    allColoringInvolutionsExact &&
    colorings.every((c) => c.balanced);

  const conceptUsage = new Map<string, number>();
  const cubeLabelUsage = new Map<string, number>();
  for (const c of cells) {
    cubeLabelUsage.set(c.exteriorLabel, (cubeLabelUsage.get(c.exteriorLabel) ?? 0) + 1);
    cubeLabelUsage.set(c.interiorLabel, (cubeLabelUsage.get(c.interiorLabel) ?? 0) + 1);
    for (const r of c.relations) {
      conceptUsage.set(r.left, (conceptUsage.get(r.left) ?? 0) + 1);
      conceptUsage.set(r.right, (conceptUsage.get(r.right) ?? 0) + 1);
    }
  }

  return {
    instruction: {
      title: 'Un único teseracto ({4,3,3}) — Clausura completa de 12 coloraciones (6 pares involutivos)',
      source:
        'Conjunto maestro IMG-000207 (8 paneles) + 7 láminas individuales (12 coloraciones · 6 pares) · docs/TCAAU.md',
      assetPath: '/assets/aistudio/IMG_20261123_031910_595b8f79.jpg',
      mirrorAssetPath: '/assets/aistudio/TSRIMG_20261123_023812_55e05147.jpg',
      mirrorFrameSwapAssetPath: '/assets/aistudio/IMG_20261123_063146_8d038bdc.jpg',
      parityPolarMirrorAssetPath: '/assets/aistudio/IMG_20261123_070052_2e86be46.jpg',
      parityPolarSwapAssetPath: '/assets/aistudio/IMG_20261123_064557_52d8695d.jpg',
      parityMirrorAssetPath: '/assets/aistudio/IMG_20261123_025743_a2265a38.jpg',
      analysisAssetPath: '/assets/aistudio/IMG_20261123_015713_b7332827.jpg',
      compositeSetAssetPath: '/assets/aistudio/IMG_20261124_000207_382065f8.jpg',
      monochromeAssetPath: '/assets/aistudio/TSST_20261123_003603_de3cb84c.jpg',
      pdfPath: '/assets/aistudio/1000000566_f7cafcef.pdf',
      colorAssets: colorings.map((c) => ({
        id: c.id,
        assetTag: c.assetTag,
        shortLabel: c.shortLabel,
        family: c.family,
        assetPath: c.assetPath,
      })),
      rules: [
        'Las ocho configuraciones (2×4: parte superior T1–T4 y parte inferior T5–T8) agotan las reorientaciones posibles del único teseracto tetradimensional ({4,3,3}) sin añadir un segundo objeto.',
        'Conjunto maestro IMG-000207 (8 en 1) + láminas individuales: reúnen 12 coloraciones cromáticas organizadas en 6 pares involutivos exactos donde ninguna arista ni dualidad queda sin su espejo.',
        'Familia de marcos (6 coloraciones · 3 pares): IMG-031910 ↔ TSRIMG, IMG-063146 (#5) ↔ IMG-000207 #7 e IMG-000207 #1 ↔ #3 invierten {T1↔T4, T6↔T7} y {T2↔T3, T5↔T8} bajo Azul ↔ Rojo · Amarillo ↔ Verde.',
        'Familia por paridad (6 coloraciones · 3 pares): IMG-070052 ↔ IMG-064557 (Amarillo ↔ Rojo · Azul ↔ Verde), IMG-000207 #2 ↔ #6 e IMG-025743 (#8) ↔ IMG-015713 (#4) cierran P0 y P1; toda posición es ya subposición reflejada.',
      ],
    },
    schlafli: '{4,3,3}',
    geometry: {
      cubicCells: 8,
      faces: 24,
      edges: 32,
      vertices: 16,
      dual: '16-celda (8 vértices en 4 pares antipodales)',
    },
    concepts: [...TESSERACT_CONCEPTS],
    cubeLabels: [...TESSERACT_CUBE_LABELS],
    colorings,
    analysisChains: [...ANALYSIS_CHAINS_INFO],
    parityMirrorChains: [...PARITY_MIRROR_CHAINS_INFO],
    mirrorChains: [...MIRROR_CHAINS_INFO],
    mirrorReflectedChains: [...MIRROR_REFLECTED_CHAINS_INFO],
    cells,
    verification: {
      totalRelations: cells.reduce((acc, c) => acc + c.relations.length, 0),
      realArrowCount,
      virtualArrowCount,
      continuousExtCount,
      dashedExtCount,
      coloringsCount: colorings.length,
      allRealUseRightArrow,
      allHaveOneRealOneVirtual,
      allHaveOneContinuousOneDashed,
      allCubeLinesMatchHeader,
      allAnalysisChainsBalanced,
      allParityMirrorChainsBalanced,
      allMirrorChainsBalanced,
      allMirrorReflectedChainsBalanced,
      allColoringInvolutionsExact,
      allColoringsClosed,
      allConceptsCovered: TESSERACT_CONCEPTS.every((k) => (conceptUsage.get(k) ?? 0) > 0),
      allCubeLabelsCovered: TESSERACT_CUBE_LABELS.every((k) => (cubeLabelUsage.get(k) ?? 0) > 0),
      conceptCounts: TESSERACT_CONCEPTS.map((k) => ({ id: k, count: conceptUsage.get(k) ?? 0 })),
      cubeLabelCounts: TESSERACT_CUBE_LABELS.map((k) => ({
        id: k,
        count: cubeLabelUsage.get(k) ?? 0,
      })),
    },
  };
}



