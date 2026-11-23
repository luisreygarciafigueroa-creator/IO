import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  Compass,
  GitBranch,
  Layers,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Box,
  Download,
} from 'lucide-react';
import {
  ANALYSIS_CHAIN_STYLES,
  CubeGlyph,
  getAnalysisChainColor,
  getAnalysisChainTextColor,
  TesseractFlowchart,
  TesseractMiniSchlegel,
  type AnalysisChainColor,
  type FlowFilter,
  type TesseractColorMode,
} from './TesseractFlowchart.tsx';
import { buildEvalAuditFilename, serializeEvalAuditPayload } from './evalAuditExport';

type TabId = 'core' | 'tesseracts' | 'invariance' | 'eval' | 'domain';
type RelationLabel = 'none' | 'mirrorOf' | 'creates';
type EvalLabel = RelationLabel | 'unsure';

interface SpecResponse {
  spec: {
    schema_version: string;
    spec_version: string;
    title: string;
    source_date: string;
    source_note: string;
    five_perspectives: Array<{
      id: string;
      label: string;
      index: number;
      kind: string;
      description: string;
    }>;
    vectors: Array<{
      name: string;
      phase: 'adv' | 'ret';
      labels: string[];
      axis_positions: number[];
      arrow: string;
    }>;
    purpose: {
      label: string;
      definition: string;
      criterion: string;
      chain: string[];
      note: string;
    };
  };
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
  expandedCategories: Array<{ id: string; level: number; label: string }>;
}

interface TriadNode {
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

interface RelationCandidate {
  triad_index: number;
  source: string;
  target: string;
  relation: RelationLabel;
}

interface RuleCheckResult {
  source: string;
  target: string;
  sameTriad: boolean;
  oppositePhase: boolean;
  mirrorPositional: boolean;
  createsPositional: boolean;
  relation: RelationLabel;
  explanation: string;
}

interface InvarianceResponse {
  fixedPoint: SpecResponse['fixedPoint'];
  counts: SpecResponse['counts'];
  invariance: {
    framing: string;
    canonical: {
      self_regeneration_rate: number;
      triad_index_invariance: boolean;
      subset_reconstruction: boolean;
      loo_folds_checked: number;
      autonomy_measurable: boolean;
    };
    negative_control: {
      description: string;
      corrupted_edge: {
        index: number;
        source: string;
        target: string;
        original: RelationLabel;
      } | null;
      corrupted_self_regeneration_rate: number;
      corrupted_triad_invariance: boolean;
      corrupted_subset_reconstruction: boolean;
      detects_corruption: boolean;
    };
    invariance_non_trivial: boolean;
  };
}

interface IndependentEvalResponse {
  annotations: {
    description: string;
    annotators: string[];
    annotator_profiles: Record<string, string>;
    status: string;
    items: Array<{
      id: string;
      kind?: string;
      annotations: Record<string, EvalLabel | null>;
      consensus?: string;
      unanimous?: boolean;
    }>;
  };
  ruleReference: Record<string, { rule_label: string; notes: string }>;
  pairs: Array<{ id: string; source_label: string; target_label: string; context: string }>;
  report: EvalReport;
}

interface EvalReport {
  status: string;
  n_pairs_total: number;
  n_pairs_in_kappa: number;
  n_pairs_incomplete: number;
  min_annotators_required: number;
  kappa_annotators: string[];
  fleiss_kappa: number | null;
  unanimous_count: number;
  unanimous_fraction: number | null;
  majority_labels_in_kappa: Record<string, string>;
  label_distribution_present: Record<string, number>;
  unsure_count_by_pair: Record<string, number>;
  posthoc_agreement_with_rule_reference: number | null;
  n_posthoc_comparable: number;
  incomplete_detail: Record<string, unknown>;
  policy: string;
}

interface DomainMappingResponse {
  experiment: string;
  title: string;
  note: string;
  ok: number;
  warn: number;
  fail: number;
  pairs: Array<{
    id: string;
    domain: string;
    source_label: string;
    target_label: string;
    perspective: string;
    phase_hint: string;
    relation: RelationLabel;
    analytic_impact: string;
    suggested_nodes: { source: string; target: string; note: string };
    source_node_label?: string;
    target_node_label?: string;
    status: 'OK' | 'WARN' | 'FAIL';
    gold_relation: string | null;
    reason: string;
  }>;
}

interface QuizResponse {
  title: string;
  questions: Array<{
    id: string;
    prompt: string;
    options: Record<string, string>;
    answer: string;
    rationale: string;
  }>;
  metrics_reference: Record<string, unknown>;
}

interface QuizScoreResponse {
  correct: number;
  total: number;
  passed: boolean;
  results: Array<{
    id: string;
    received: string | null;
    expected: string;
    ok: boolean;
    rationale: string;
  }>;
}

interface TesseractRelation {
  left: string;
  arrow: '>' | '<';
  line: '_' | '...';
  right: string;
  domain: 'real' | 'virtual';
  cube: 'exterior' | 'interior';
  cubeLabel: string;
  analysisChain: AnalysisChainColor;
  mirrorChain: AnalysisChainColor;
  parityMirrorChain: AnalysisChainColor;
  mirrorReflectedChain: AnalysisChainColor;
  notation: string;
}

interface TesseractResponse {
  instruction: {
    title: string;
    source: string;
    assetPath?: string;
    parityMirrorAssetPath?: string;
    mirrorAssetPath?: string;
    analysisAssetPath?: string;
    monochromeAssetPath?: string;
    pdfPath?: string;
    rules: string[];
  };
  schlafli: string;
  geometry: {
    cubicCells: number;
    faces: number;
    edges: number;
    vertices: number;
    dual: string;
  };
  concepts: string[];
  cubeLabels: string[];
  analysisChains: Array<{
    id: AnalysisChainColor;
    label: string;
    parity: 0 | 1;
    arrow: '>' | '<';
    domain: 'real' | 'virtual';
    cellIds: string[];
    cubeLabels: string[];
    summary: string;
  }>;
  parityMirrorChains: Array<{
    id: AnalysisChainColor;
    label: string;
    parity: 0 | 1;
    arrow: '>' | '<';
    domain: 'real' | 'virtual';
    cellIds: string[];
    cubeLabels: string[];
    summary: string;
  }>;
  mirrorChains: Array<{
    id: AnalysisChainColor;
    label: string;
    cellIds: string[];
    cubeLabels: string[];
    modalSwap: string;
    summary: string;
  }>;
  mirrorReflectedChains: Array<{
    id: AnalysisChainColor;
    label: string;
    cellIds: string[];
    cubeLabels: string[];
    modalSwap: string;
    summary: string;
  }>;
  cells: Array<{
    id: string;
    index: number;
    row: 'superior' | 'inferior';
    col: 1 | 2 | 3 | 4;
    axisPair: string;
    exteriorLabel: string;
    exteriorLine: '_' | '...';
    exteriorChain: AnalysisChainColor;
    exteriorMirrorChain: AnalysisChainColor;
    exteriorParityMirrorChain: AnalysisChainColor;
    exteriorMirrorReflectedChain: AnalysisChainColor;
    interiorLabel: string;
    interiorLine: '_' | '...';
    interiorChain: AnalysisChainColor;
    interiorMirrorChain: AnalysisChainColor;
    interiorParityMirrorChain: AnalysisChainColor;
    interiorMirrorReflectedChain: AnalysisChainColor;
    coords: [0 | 1, 0 | 1, 0 | 1];
    parity: 0 | 1;
    half: string;
    relations: [TesseractRelation, TesseractRelation];
    neighbors: { horizontal: string; vertical: string; diagonal: string };
  }>;
  verification: {
    totalRelations: number;
    realArrowCount: number;
    virtualArrowCount: number;
    continuousExtCount: number;
    dashedExtCount: number;
    allRealUseRightArrow: boolean;
    allHaveOneRealOneVirtual: boolean;
    allHaveOneContinuousOneDashed: boolean;
    allCubeLinesMatchHeader: boolean;
    allAnalysisChainsBalanced: boolean;
    allParityMirrorChainsBalanced: boolean;
    allMirrorChainsBalanced: boolean;
    allMirrorReflectedChainsBalanced: boolean;
    allConceptsCovered: boolean;
    allCubeLabelsCovered: boolean;
    conceptCounts: Array<{ id: string; count: number }>;
    cubeLabelCounts: Array<{ id: string; count: number }>;
  };
}

function RelationBadge({ relation }: { relation: string }) {
  const styles: Record<string, string> = {
    mirrorOf: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    creates: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    none: 'bg-slate-800 text-slate-400 border-slate-700',
    unsure: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    tie: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${
        styles[relation] ?? styles.none
      }`}
    >
      {relation}
    </span>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('core');
  const [specData, setSpecData] = useState<SpecResponse | null>(null);
  const [nodes, setNodes] = useState<TriadNode[]>([]);
  const [candidates, setCandidates] = useState<RelationCandidate[]>([]);
  const [selectedTriad, setSelectedTriad] = useState<number>(1);
  const [ruleSource, setRuleSource] = useState<string>('T01_adv_P0');
  const [ruleTarget, setRuleTarget] = useState<string>('T01_ret_P2');
  const [ruleResult, setRuleResult] = useState<RuleCheckResult | null>(null);

  const [invarianceData, setInvarianceData] = useState<InvarianceResponse | null>(null);
  const [corruptIdx, setCorruptIdx] = useState<number>(0);

  const [evalData, setEvalData] = useState<IndependentEvalResponse | null>(null);
  const [editedAnnotations, setEditedAnnotations] = useState<
    IndependentEvalResponse['annotations'] | null
  >(null);
  const [liveReport, setLiveReport] = useState<EvalReport | null>(null);

  const [domainData, setDomainData] = useState<DomainMappingResponse | null>(null);
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<QuizScoreResponse | null>(null);
  const [tesseractData, setTesseractData] = useState<TesseractResponse | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<string>('T1');
  const [flowFilter, setFlowFilter] = useState<FlowFilter>('all');
  const [colorMode, setColorMode] = useState<TesseractColorMode>('mirrorReflected');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        const [specRes, triadsRes, invRes, evalRes, domRes, quizRes, tessRes] = await Promise.all([
          fetch('/api/spec').then((r) => r.json()),
          fetch('/api/triads').then((r) => r.json()),
          fetch('/api/invariance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          }).then((r) => r.json()),
          fetch('/api/independent-eval').then((r) => r.json()),
          fetch('/api/domain-mapping').then((r) => r.json()),
          fetch('/api/quiz').then((r) => r.json()),
          fetch('/api/tesseract').then((r) => r.json()),
        ]);

        setSpecData(specRes);
        setNodes(triadsRes.nodes);
        setCandidates(triadsRes.relationCandidates);
        setInvarianceData(invRes);
        setEvalData(evalRes);
        setEditedAnnotations(evalRes.annotations);
        setLiveReport(evalRes.report);
        setDomainData(domRes);
        setQuizData(quizRes);
        setTesseractData(tessRes);
      } catch (err) {
        setErrorMsg((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  useEffect(() => {
    async function checkRule() {
      if (!ruleSource || !ruleTarget) return;
      const res = await fetch('/api/rule-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: ruleSource, target: ruleTarget }),
      }).then((r) => r.json());
      setRuleResult(res);
    }
    checkRule();
  }, [ruleSource, ruleTarget]);

  const triadsGrouped = useMemo(() => {
    const map = new Map<number, { adv: TriadNode[]; ret: TriadNode[] }>();
    for (const node of nodes) {
      if (!map.has(node.triad_index)) {
        map.set(node.triad_index, { adv: [], ret: [] });
      }
      const bucket = map.get(node.triad_index)!;
      if (node.phase === 'adv') bucket.adv.push(node);
      else bucket.ret.push(node);
    }
    for (const bucket of map.values()) {
      bucket.adv.sort((a, b) => a.position_index - b.position_index);
      bucket.ret.sort((a, b) => a.position_index - b.position_index);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [nodes]);

  const selectedTriadCandidates = useMemo(
    () => candidates.filter((c) => c.triad_index === selectedTriad),
    [candidates, selectedTriad]
  );

  const nodeLabelMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const n of nodes) m.set(n.node_id, n.label);
    return m;
  }, [nodes]);

  async function runInvarianceWithCorruption(idx: number) {
    setCorruptIdx(idx);
    const res = await fetch('/api/invariance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corruptCandidateIndex: idx }),
    }).then((r) => r.json());
    setInvarianceData(res);
  }

  async function updateEvalAnnotation(
    itemId: string,
    annotatorId: string,
    value: string
  ) {
    if (!editedAnnotations) return;
    const next: IndependentEvalResponse['annotations'] = {
      ...editedAnnotations,
      items: editedAnnotations.items.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          annotations: {
            ...item.annotations,
            [annotatorId]: value === '__null__' ? null : (value as EvalLabel),
          },
        };
      }),
    };
    setEditedAnnotations(next);
    const res = await fetch('/api/independent-eval/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ annotations: next, minAnnotators: 3 }),
    }).then((r) => r.json());
    if (res.report) setLiveReport(res.report);
  }

  async function resetAnnotations() {
    if (!evalData) return;
    setEditedAnnotations(evalData.annotations);
    setLiveReport(evalData.report);
  }

  function downloadEvalAuditJson() {
    if (!liveReport || !editedAnnotations) return;
    const now = new Date();
    const json = serializeEvalAuditPayload(liveReport, editedAnnotations, now.toISOString());
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = buildEvalAuditFilename(now);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function submitQuiz() {
    const res = await fetch('/api/quiz/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: quizAnswers }),
    }).then((r) => r.json());
    setQuizScore(res);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
          Cargando especificación canónica IOM y artefactos verificados...
        </div>
      </div>
    );
  }

  if (errorMsg || !specData) {
    return (
      <div className="min-h-screen bg-slate-950 text-rose-300 flex items-center justify-center p-6">
        <div className="max-w-lg border border-rose-500/30 bg-rose-950/30 rounded-xl p-6">
          <h2 className="font-semibold text-base mb-2">Error al cargar IOM</h2>
          <p className="text-sm text-rose-200/80">{errorMsg ?? 'Sin respuesta del servidor'}</p>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'core', label: 'Núcleo & 13 Tríadas', icon: <Layers className="w-4 h-4" /> },
    { id: 'tesseracts', label: 'Teseractos ({4,3,3})', icon: <Box className="w-4 h-4" /> },
    { id: 'invariance', label: 'Invariancia & Punto Fijo', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'eval', label: "Evaluación Independiente (κ)", icon: <Activity className="w-4 h-4" /> },
    { id: 'domain', label: 'Dominio (EXP-E) & Quiz', icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  spec v{specData.spec.spec_version}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {specData.counts.nodes} nodos · {specData.counts.totalCandidates} candidatos
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mt-2">
                {specData.spec.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                {specData.spec.purpose.definition}
              </p>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-300 font-mono">
              <div className="text-slate-500 mb-1">Cadena operativa</div>
              <div className="flex flex-wrap items-center gap-1">
                {specData.spec.purpose.chain.map((step, i) => (
                  <React.Fragment key={step}>
                    <span className="text-sky-300">{step}</span>
                    {i < specData.spec.purpose.chain.length - 1 && (
                      <span className="text-slate-600">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 mt-5">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    active
                      ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'core' && (
          <>
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs text-slate-400">Tríadas</div>
                <div className="text-2xl font-semibold font-mono text-white mt-1">
                  {specData.counts.triads}
                </div>
                <div className="text-[11px] text-slate-500">modos de composición</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs text-slate-400">Nodos (13×2×3)</div>
                <div className="text-2xl font-semibold font-mono text-white mt-1">
                  {specData.counts.nodes}
                </div>
                <div className="text-[11px] text-slate-500">avance + retroceso</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs text-slate-400">mirrorOf</div>
                <div className="text-2xl font-semibold font-mono text-sky-300 mt-1">
                  {specData.counts.mirrorDirected}
                </div>
                <div className="text-[11px] text-slate-500">13 × 6 dirigidas</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs text-slate-400">creates</div>
                <div className="text-2xl font-semibold font-mono text-emerald-300 mt-1">
                  {specData.counts.createsDirected}
                </div>
                <div className="text-[11px] text-slate-500">13 × 8 dirigidas</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs text-slate-400">Vectores (4×5)</div>
                <div className="text-2xl font-semibold font-mono text-amber-300 mt-1">
                  {specData.counts.vectorSteps}
                </div>
                <div className="text-[11px] text-slate-500">Evol / Invol</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-xs text-slate-400">Partición 390</div>
                <div className="text-2xl font-semibold font-mono text-white mt-1">
                  {specData.counts.partitionValid ? 'OK' : 'ERR'}
                </div>
                <div className="text-[11px] text-slate-500">78 + 104 + 208 = 390</div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-sky-400" />
                    Las 13 Tríadas (Avance →|0|→ y Retroceso ←|0|←)
                  </h2>
                  <span className="text-xs text-slate-400">Clic para inspeccionar pares</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 pr-2 font-mono">ID</th>
                        <th className="py-2 px-2">Avance (Ind · D · Tot)</th>
                        <th className="py-2 pl-2">Retroceso (Ind · D · Tot)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {triadsGrouped.map(([idx, group]) => {
                        const isSelected = selectedTriad === idx;
                        return (
                          <tr
                            key={idx}
                            onClick={() => setSelectedTriad(idx)}
                            className={`cursor-pointer transition ${
                              isSelected ? 'bg-sky-500/10' : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-2.5 pr-2 font-mono text-sky-300 font-medium">
                              T{String(idx).padStart(2, '0')}
                            </td>
                            <td className="py-2.5 px-2">
                              <div className="flex flex-wrap gap-1.5">
                                {group.adv.map((n) => (
                                  <span
                                    key={n.node_id}
                                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200"
                                  >
                                    <span className="text-slate-500 mr-1 font-mono">{n.display_label}</span>
                                    {n.label}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 pl-2">
                              <div className="flex flex-wrap gap-1.5">
                                {group.ret.map((n) => (
                                  <span
                                    key={n.node_id}
                                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                                  >
                                    <span className="text-slate-500 mr-1 font-mono">{n.display_label}</span>
                                    {n.label}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
                    <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                    Evaluador FormalRules (Lean 4 → TypeScript)
                  </h2>
                  <p className="text-xs text-slate-400 mb-4">
                    Evalúa <code className="text-sky-300">sameTriad</code>,{' '}
                    <code className="text-sky-300">isMirrorRel</code> e{' '}
                    <code className="text-sky-300">isCreatesRel</code> sobre cualquier par de los 78 nodos.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Origen (source)</label>
                      <select
                        value={ruleSource}
                        onChange={(e) => setRuleSource(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 font-mono"
                      >
                        {nodes.map((n) => (
                          <option key={n.node_id} value={n.node_id}>
                            {n.node_id} — {n.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Destino (target)</label>
                      <select
                        value={ruleTarget}
                        onChange={(e) => setRuleTarget(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 font-mono"
                      >
                        {nodes.map((n) => (
                          <option key={n.node_id} value={n.node_id}>
                            {n.node_id} — {n.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {ruleResult && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Relación derivada:</span>
                        <RelationBadge relation={ruleResult.relation} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                        <div className="text-slate-400">
                          sameTriad:{' '}
                          <span className={ruleResult.sameTriad ? 'text-emerald-300' : 'text-rose-300'}>
                            {String(ruleResult.sameTriad)}
                          </span>
                        </div>
                        <div className="text-slate-400">
                          oppositePhase:{' '}
                          <span className={ruleResult.oppositePhase ? 'text-emerald-300' : 'text-rose-300'}>
                            {String(ruleResult.oppositePhase)}
                          </span>
                        </div>
                        <div className="text-slate-400">
                          mirrorPos:{' '}
                          <span className={ruleResult.mirrorPositional ? 'text-sky-300' : 'text-slate-500'}>
                            {String(ruleResult.mirrorPositional)}
                          </span>
                        </div>
                        <div className="text-slate-400">
                          createsPos:{' '}
                          <span className={ruleResult.createsPositional ? 'text-emerald-300' : 'text-slate-500'}>
                            {String(ruleResult.createsPositional)}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-300 pt-1 border-t border-slate-800/80">
                        {ruleResult.explanation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Tríada T{String(selectedTriad).padStart(2, '0')} — 30 Pares Dirigidos
                  </h3>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 text-xs">
                    {selectedTriadCandidates.map((c) => (
                      <div
                        key={`${c.source}-${c.target}`}
                        className="py-1.5 flex items-center justify-between gap-2"
                      >
                        <div className="font-mono text-slate-300 truncate">
                          {c.source}{' '}
                          <span className="text-slate-500">({nodeLabelMap.get(c.source)})</span> →{' '}
                          {c.target}{' '}
                          <span className="text-slate-500">({nodeLabelMap.get(c.target)})</span>
                        </div>
                        <RelationBadge relation={c.relation} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Las 5 Perspectivas Canónicas
                </h3>
                <div className="space-y-2.5">
                  {specData.spec.five_perspectives.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">
                          {p.index}. {p.label} ({p.id})
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                          {p.kind}
                        </span>
                      </div>
                      <p className="text-slate-400">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Secuencias Vectoriales (4 × 5 = 20 pasos)
                </h3>
                <div className="space-y-3">
                  {specData.spec.vectors.map((v) => (
                    <div
                      key={`${v.name}-${v.phase}`}
                      className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-semibold text-sky-300">
                          {v.name} · fase {v.phase} ({v.arrow})
                        </span>
                        <span className="font-mono text-slate-500">
                          ejes [{v.axis_positions.join(', ')}]
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 font-mono">
                        {v.labels.map((lab, i) => (
                          <React.Fragment key={`${lab}-${i}`}>
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">
                              {lab}
                            </span>
                            {i < v.labels.length - 1 && (
                              <span className="text-slate-500">{v.arrow}</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'tesseracts' && tesseractData && (
          <div className="space-y-6">
            <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Box className="w-4 h-4 text-sky-400" />
                    {tesseractData.instruction.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Fuente: {tesseractData.instruction.source} · Dual: {tesseractData.geometry.dual}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    1 teseracto · {tesseractData.geometry.cubicCells} proyecciones (2 × 4)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    anverso/reverso · 4 espejos · {tesseractData.verification.totalRelations} transiciones
                  </span>
                  {tesseractData.instruction.assetPath && (
                    <a
                      href={tesseractData.instruction.assetPath}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition"
                    >
                      Diagrama (espejado 2ª img)
                    </a>
                  )}
                  {tesseractData.instruction.parityMirrorAssetPath && (
                    <a
                      href={tesseractData.instruction.parityMirrorAssetPath}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                      Diagrama (espejeo paridad)
                    </a>
                  )}
                  {tesseractData.instruction.mirrorAssetPath && (
                    <a
                      href={tesseractData.instruction.mirrorAssetPath}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                      Diagrama (espejeo marcos)
                    </a>
                  )}
                  {tesseractData.instruction.analysisAssetPath && (
                    <a
                      href={tesseractData.instruction.analysisAssetPath}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                      Diagrama (cadenas paridad)
                    </a>
                  )}
                  {tesseractData.instruction.monochromeAssetPath && (
                    <a
                      href={tesseractData.instruction.monochromeAssetPath}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      Diagrama monocromo
                    </a>
                  )}
                  {tesseractData.instruction.pdfPath && (
                    <a
                      href={tesseractData.instruction.pdfPath}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      Lámina PDF
                    </a>
                  )}
                </div>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                {tesseractData.instruction.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 leading-relaxed"
                  >
                    <span className="font-mono text-sky-300 font-semibold mr-1.5">{idx + 1}.</span>
                    {rule}
                  </li>
                ))}
              </ol>

              <div className="bg-slate-950/75 border border-slate-800 rounded-lg p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200 block">
                      {colorMode === 'mirrorReflected'
                        ? '4 Espejados de la 2ª imagen (reverso de TSRIMG: Azul ↔ Rojo · Amarillo ↔ Verde)'
                        : colorMode === 'parityMirror'
                        ? '4 Cadenas reflejadas (reverso del análisis anterior: Azul ↔ Rojo · Amarillo ↔ Verde)'
                        : colorMode === 'mirror'
                        ? '4 Espejeos cromáticos internos (reflexión de marcos del teseracto único)'
                        : '4 Cadenas de análisis por color (anverso por paridad)'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 block">
                      {colorMode === 'mirrorReflected'
                        ? 'El color actual realiza el espejado exacto del análisis de la segunda imagen (TSRIMG): anverso y reverso de una sola operación de lectura interna.'
                        : colorMode === 'parityMirror'
                        ? 'Los colores actuales realizan el espejeo del análisis anterior: anverso y reverso de una sola lectura contenida en el mismo teseracto.'
                        : colorMode === 'mirror'
                        ? 'El color revela el espejeo interno del teseracto único: no añade información externa, hace legible la reflexión especular entre cuadrantes.'
                        : 'El color señala únicamente la forma de analizar las conexiones por paridad, no una diferencia sustancial.'}
                    </span>
                  </div>
                  <div
                    role="group"
                    aria-label="Lectura cromática"
                    className="inline-flex flex-wrap items-center rounded-lg bg-slate-900 border border-slate-700 p-0.5 font-mono text-[11px]"
                  >
                    <button
                      type="button"
                      onClick={() => setColorMode('mirrorReflected')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        colorMode === 'mirrorReflected'
                          ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Espejado 2ª img (IMG-031910)
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode('parityMirror')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        colorMode === 'parityMirror'
                          ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Espejeo paridad (IMG-025743)
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode('mirror')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        colorMode === 'mirror'
                          ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Espejeo marcos (TSRIMG)
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode('parity')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        colorMode === 'parity'
                          ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Cadenas paridad (IMG-015713)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {colorMode === 'mirrorReflected' || colorMode === 'mirror'
                    ? (colorMode === 'mirrorReflected'
                        ? tesseractData.mirrorReflectedChains
                        : tesseractData.mirrorChains
                      ).map((mirror) => {
                        const st = ANALYSIS_CHAIN_STYLES[mirror.id];
                        const active = flowFilter === mirror.id;
                        return (
                          <button
                            key={mirror.id}
                            onClick={() => {
                              const next = active ? 'all' : mirror.id;
                              setFlowFilter(next);
                              if (!active && !mirror.cellIds.includes(selectedCellId)) {
                                setSelectedCellId(mirror.cellIds[0]);
                              }
                            }}
                            style={
                              active
                                ? { backgroundColor: st.bg, borderColor: st.stroke }
                                : { borderColor: `${st.stroke}40` }
                            }
                            className="text-left rounded-lg px-3 py-2 bg-slate-900/70 border hover:bg-slate-900 transition cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2 font-mono text-xs">
                              <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: st.text }}>
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: st.stroke }}
                                />
                                {mirror.label} (2 › / 2 ‹)
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {mirror.cellIds[0]}↔{mirror.cellIds[1]} · {mirror.cellIds[2]}↔{mirror.cellIds[3]}
                              </span>
                            </div>
                            <div className="font-mono text-[10.5px] text-slate-300 mt-1">
                              {mirror.cubeLabels.join(' ↔ ')}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                              {mirror.modalSwap}
                            </div>
                          </button>
                        );
                      })
                    : (colorMode === 'parityMirror'
                        ? tesseractData.parityMirrorChains
                        : tesseractData.analysisChains
                      ).map((chain) => {
                        const st = ANALYSIS_CHAIN_STYLES[chain.id];
                        const active = flowFilter === chain.id;
                        return (
                          <button
                            key={chain.id}
                            onClick={() => {
                              const next = active ? 'all' : chain.id;
                              setFlowFilter(next);
                              if (!active && !chain.cellIds.includes(selectedCellId)) {
                                setSelectedCellId(chain.cellIds[0]);
                              }
                            }}
                            style={
                              active
                                ? { backgroundColor: st.bg, borderColor: st.stroke }
                                : { borderColor: `${st.stroke}40` }
                            }
                            className="text-left rounded-lg px-3 py-2 bg-slate-900/70 border hover:bg-slate-900 transition cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2 font-mono text-xs">
                              <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: st.text }}>
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: st.stroke }}
                                />
                                {chain.label} ({chain.arrow === '>' ? '›' : '‹'})
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Paridad {chain.parity}
                              </span>
                            </div>
                            <div className="font-mono text-[10.5px] text-slate-300 mt-1">
                              {chain.cellIds.join(' → ')}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                              {chain.cubeLabels.join(' · ')}
                            </div>
                          </button>
                        );
                      })}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400">Dirección &gt; / &lt;</div>
                <div className="text-lg font-mono text-emerald-300 mt-1">
                  {tesseractData.verification.allRealUseRightArrow ? 'VERIFICADO' : 'ERROR'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {tesseractData.verification.realArrowCount} real (&gt;) ·{' '}
                  {tesseractData.verification.virtualArrowCount} virtual (&lt;)
                </div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400">Balance por celda</div>
                <div className="text-lg font-mono text-emerald-300 mt-1">
                  {tesseractData.verification.allHaveOneRealOneVirtual &&
                  tesseractData.verification.allHaveOneContinuousOneDashed
                    ? 'VERIFICADO'
                    : 'ERROR'}
                </div>
                <div className="text-[11px] text-slate-500">1 › + 1 ‹ · 1 _ + 1 ... en las 8</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400">Anverso / Reverso &amp; Espejos</div>
                <div className="text-lg font-mono text-sky-300 mt-1">
                  {tesseractData.verification.allMirrorReflectedChainsBalanced &&
                  tesseractData.verification.allParityMirrorChainsBalanced &&
                  tesseractData.verification.allMirrorChainsBalanced &&
                  tesseractData.verification.allAnalysisChainsBalanced
                    ? 'VERIFICADO'
                    : 'ERROR'}
                </div>
                <div className="text-[11px] text-slate-500">
                  espejado 4×4 · reverso 4×4 · marcos 4×4
                </div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400">Cubos &amp; Cobertura</div>
                <div className="text-lg font-mono text-emerald-300 mt-1">
                  {tesseractData.concepts.length} / {tesseractData.cubeLabels.length}
                </div>
                <div className="text-[11px] text-slate-500">
                  cabeceras:{' '}
                  {tesseractData.verification.allCubeLinesMatchHeader &&
                  tesseractData.verification.allConceptsCovered &&
                  tesseractData.verification.allCubeLabelsCovered
                    ? 'OK'
                    : 'ERR'}
                </div>
              </div>
            </section>

            <TesseractFlowchart
              tesseractData={tesseractData}
              selectedCellId={selectedCellId}
              onSelectCell={setSelectedCellId}
              flowFilter={flowFilter}
              colorMode={colorMode}
              onFlowFilterChange={(next) => {
                setFlowFilter(next);
                if (next === 'azul' || next === 'amarillo' || next === 'rojo' || next === 'verde') {
                  const activeList =
                    colorMode === 'mirrorReflected'
                      ? tesseractData.mirrorReflectedChains
                      : colorMode === 'parityMirror'
                      ? tesseractData.parityMirrorChains
                      : colorMode === 'mirror'
                      ? tesseractData.mirrorChains
                      : tesseractData.analysisChains;
                  const chain = activeList.find((ch) => ch.id === next);
                  if (chain && !chain.cellIds.includes(selectedCellId)) {
                    setSelectedCellId(chain.cellIds[0]);
                  }
                }
              }}
            />

            {(() => {
              const selectedCell =
                tesseractData.cells.find((c) => c.id === selectedCellId) ?? tesseractData.cells[0];
              const superiorCells = tesseractData.cells.filter((c) => c.row === 'superior');
              const inferiorCells = tesseractData.cells.filter((c) => c.row === 'inferior');
              const isChainFilter =
                flowFilter === 'azul' ||
                flowFilter === 'amarillo' ||
                flowFilter === 'rojo' ||
                flowFilter === 'verde';

              const resolveRelChain = (rel: TesseractRelation): AnalysisChainColor =>
                colorMode === 'mirrorReflected'
                  ? rel.mirrorReflectedChain
                  : colorMode === 'parityMirror'
                  ? rel.parityMirrorChain
                  : colorMode === 'mirror'
                  ? rel.mirrorChain
                  : rel.analysisChain;

              const renderCellCard = (cell: TesseractResponse['cells'][number], idx: number) => {
                const active = cell.id === selectedCell.id;
                const extChain =
                  colorMode === 'mirrorReflected'
                    ? cell.exteriorMirrorReflectedChain
                    : colorMode === 'parityMirror'
                    ? cell.exteriorParityMirrorChain
                    : colorMode === 'mirror'
                    ? cell.exteriorMirrorChain
                    : cell.exteriorChain;
                const intChain =
                  colorMode === 'mirrorReflected'
                    ? cell.interiorMirrorReflectedChain
                    : colorMode === 'parityMirror'
                    ? cell.interiorParityMirrorChain
                    : colorMode === 'mirror'
                    ? cell.interiorMirrorChain
                    : cell.interiorChain;
                const cellMatchesChain =
                  !isChainFilter || extChain === flowFilter || intChain === flowFilter;
                const continuousLabel =
                  cell.exteriorLine === '_' ? cell.exteriorLabel : cell.interiorLabel;
                const continuousChain =
                  cell.exteriorLine === '_' ? extChain : intChain;
                const dashedLabel =
                  cell.exteriorLine === '...' ? cell.exteriorLabel : cell.interiorLabel;
                const dashedChain =
                  cell.exteriorLine === '...' ? extChain : intChain;

                return (
                  <div
                    key={cell.id}
                    className={`relative ${
                      idx > 0
                        ? 'md:before:content-[""] md:before:absolute md:before:-left-2 md:before:top-2 md:before:bottom-2 md:before:border-l-2 md:before:border-dashed md:before:border-slate-700/80'
                        : ''
                    }`}
                  >
                    <button
                      onClick={() => setSelectedCellId(cell.id)}
                      className={`w-full h-full text-left rounded-xl p-3 border transition cursor-pointer flex flex-col justify-between ${
                        active
                          ? 'bg-sky-500/15 border-sky-400/60'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      } ${!cellMatchesChain ? 'opacity-40' : ''}`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono font-semibold text-sm text-white">
                            {cell.id}
                          </span>
                          <span className="px-1.5 py-0.5 rounded font-mono text-[9.5px] leading-tight bg-slate-800 text-slate-200 whitespace-nowrap">
                            {cell.axisPair}
                          </span>
                        </div>
                        <div className="mb-2">
                          <TesseractMiniSchlegel cell={cell} colorMode={colorMode} />
                        </div>
                        <div className="text-[9.5px] font-mono text-slate-400 space-y-1 mb-2 tracking-tight">
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <CubeGlyph
                              dashed={false}
                              color={getAnalysisChainColor(continuousChain)}
                              size={12}
                            />
                            <span>continuas:</span>
                            <span style={{ color: getAnalysisChainTextColor(continuousChain) }}>
                              {continuousLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <CubeGlyph
                              dashed={true}
                              color={getAnalysisChainColor(dashedChain)}
                              size={12}
                            />
                            <span>punteadas:</span>
                            <span style={{ color: getAnalysisChainTextColor(dashedChain) }}>
                              {dashedLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5 font-mono text-[10px] leading-snug tracking-tight">
                        {cell.relations.map((rel, i) => {
                          const arrowGlyph = rel.arrow === '>' ? '→' : '←';
                          const relChain = resolveRelChain(rel);
                          const glyphColor = getAnalysisChainColor(relChain, rel.domain);
                          const textColor = getAnalysisChainTextColor(relChain, rel.domain);
                          const relMatches = !isChainFilter || relChain === flowFilter;
                          return (
                            <div
                              key={i}
                              aria-label={rel.notation}
                              style={{
                                color: textColor,
                                borderColor: relMatches ? `${glyphColor}66` : 'rgba(51, 65, 85, 0.5)',
                                backgroundColor:
                                  isChainFilter && relMatches
                                    ? ANALYSIS_CHAIN_STYLES[relChain].bg
                                    : 'rgba(2, 6, 23, 0.85)',
                              }}
                              className={`px-2 py-1 rounded border flex flex-wrap items-center gap-x-1 transition ${
                                rel.line === '...' ? 'border-dashed' : 'border-solid'
                              } ${isChainFilter && !relMatches ? 'opacity-35' : ''}`}
                            >
                              <span>{rel.left}</span>
                              <span className="opacity-90">{arrowGlyph}</span>
                              <CubeGlyph dashed={rel.line === '...'} color={glyphColor} size={13} />
                              <span className="opacity-90">{arrowGlyph}</span>
                              <span>{rel.right}</span>
                            </div>
                          );
                        })}
                      </div>
                    </button>
                  </div>
                );
              };

              const selectedExtChain =
                colorMode === 'mirrorReflected'
                  ? selectedCell.exteriorMirrorReflectedChain
                  : colorMode === 'parityMirror'
                  ? selectedCell.exteriorParityMirrorChain
                  : colorMode === 'mirror'
                  ? selectedCell.exteriorMirrorChain
                  : selectedCell.exteriorChain;
              const selectedIntChain =
                colorMode === 'mirrorReflected'
                  ? selectedCell.interiorMirrorReflectedChain
                  : colorMode === 'parityMirror'
                  ? selectedCell.interiorParityMirrorChain
                  : colorMode === 'mirror'
                  ? selectedCell.interiorMirrorChain
                  : selectedCell.interiorChain;

              return (
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                      <span>Proyección superior (T1–T4, de izquierda a derecha)</span>
                      <span className="text-[11px] text-slate-500">
                        Líneas punteadas = planos de inversión · Colores ={' '}
                        {colorMode === 'mirrorReflected'
                          ? 'espejado 2ª imagen (IMG-031910)'
                          : colorMode === 'parityMirror'
                          ? 'espejeo paridad (IMG-025743)'
                          : colorMode === 'mirror'
                          ? 'espejeo marcos (TSRIMG)'
                          : 'cadenas por paridad (IMG-015713)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {superiorCells.map(renderCellCard)}
                    </div>

                    <div className="relative flex items-center justify-center py-1" role="separator">
                      <div className="w-full border-t-2 border-dashed border-slate-700" />
                      <span className="absolute px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        plano de inversión horizontal · real/virtual ↔ individualidad/totalidad · materia/vacío ↔ evolución/involución
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      Proyección inferior (T5–T8, de izquierda a derecha)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {inferiorCells.map(renderCellCard)}
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                        <span>{selectedCell.half}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10.5px] text-slate-300">
                          {colorMode === 'mirrorReflected'
                            ? selectedCell.exteriorMirrorReflectedChain === 'rojo' ||
                              selectedCell.exteriorMirrorReflectedChain === 'verde'
                              ? 'Espejado Rojo / Verde · {T1↔T4, T6↔T7}'
                              : 'Espejado Amarillo / Azul · {T2↔T3, T5↔T8}'
                            : colorMode === 'parityMirror'
                            ? selectedCell.parity === 0
                              ? 'Paridad 0 · Rojo / Verde (↔ Azul / Amarillo)'
                              : 'Paridad 1 · Azul / Amarillo (↔ Rojo / Verde)'
                            : colorMode === 'mirror'
                            ? selectedCell.exteriorMirrorChain === 'azul' ||
                              selectedCell.exteriorMirrorChain === 'amarillo'
                              ? 'Espejo Azul / Amarillo · {T1↔T4, T6↔T7}'
                              : 'Espejo Verde / Rojo · {T2↔T3, T5↔T8}'
                            : selectedCell.parity === 0
                              ? 'Paridad 0 · Azul / Amarillo'
                              : 'Paridad 1 · Rojo / Verde'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white font-mono mt-1">
                        {selectedCell.id} · {selectedCell.axisPair}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        interior ({selectedCell.interiorLine === '_' ? 'continuas _' : 'punteadas ...'}):{' '}
                        <span style={{ color: getAnalysisChainTextColor(selectedIntChain) }}>
                          {selectedCell.interiorLabel} ({selectedIntChain})
                        </span>{' '}
                        · exterior ({selectedCell.exteriorLine === '_' ? 'continuas _' : 'punteadas ...'}):{' '}
                        <span style={{ color: getAnalysisChainTextColor(selectedExtChain) }}>
                          {selectedCell.exteriorLabel} ({selectedExtChain})
                        </span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-slate-400">Navegar proyecciones del teseracto (2×4):</div>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <button
                          onClick={() => setSelectedCellId(selectedCell.neighbors.horizontal)}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 hover:border-sky-500/50 cursor-pointer"
                        >
                          <span className="font-mono text-sky-300">Par especular de eje (› ↔ ‹)</span>
                          <span className="font-mono text-white">→ {selectedCell.neighbors.horizontal}</span>
                        </button>
                        <button
                          onClick={() => setSelectedCellId(selectedCell.neighbors.vertical)}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-500/50 cursor-pointer"
                        >
                          <span className="font-mono text-emerald-300">Inversión vertical (Sup ↔ Inf)</span>
                          <span className="font-mono text-white">→ {selectedCell.neighbors.vertical}</span>
                        </button>
                        <button
                          onClick={() => setSelectedCellId(selectedCell.neighbors.diagonal)}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 hover:border-amber-500/50 cursor-pointer"
                        >
                          <span className="font-mono text-amber-300">Inversión diagonal (ext ↔ int)</span>
                          <span className="font-mono text-white">→ {selectedCell.neighbors.diagonal}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs space-y-2.5">
                      <div className="font-semibold text-slate-200">
                        Transiciones de {selectedCell.id}
                      </div>
                      {selectedCell.relations.map((rel, i) => {
                        const arrowGlyph = rel.arrow === '>' ? '→' : '←';
                        const relChain = resolveRelChain(rel);
                        const glyphColor = getAnalysisChainColor(relChain, rel.domain);
                        const textColor = getAnalysisChainTextColor(relChain, rel.domain);
                        return (
                          <div key={i} className="space-y-0.5">
                            <div
                              className="font-mono text-white inline-flex items-center gap-1.5"
                              aria-label={rel.notation}
                            >
                              <span>{rel.left}</span>
                              <span style={{ color: textColor }}>{arrowGlyph}</span>
                              <CubeGlyph dashed={rel.line === '...'} color={glyphColor} size={14} />
                              <span style={{ color: textColor }}>{arrowGlyph}</span>
                              <span>{rel.right}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              cubo {rel.cube} · {rel.cubeLabel} ({rel.line === '_' ? 'líneas continuas' : 'líneas punteadas'}) ·{' '}
                              {colorMode === 'mirrorReflected'
                                ? 'espejado'
                                : colorMode === 'parityMirror'
                                ? 'reflejo'
                                : colorMode === 'mirror'
                                ? 'espejo'
                                : 'cadena'}{' '}
                              <span className="font-mono font-semibold" style={{ color: textColor }}>
                                {relChain}
                              </span>{' '}
                              · registro {rel.domain}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })()}
          </div>
        )}

        {activeTab === 'invariance' && invarianceData && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Punto Fijo Idempotente (Sₙ₊₁ = Sₙ)
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono ${
                      invarianceData.fixedPoint.idempotent
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {invarianceData.fixedPoint.idempotent ? 'ESTABLE' : 'DIVERGENTE'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Motor determinista <code className="text-sky-300">generateArtifacts()</code>: regenera
                  nodos, pasos vectoriales y candidatos desde <code className="text-sky-300">iom_spec.json</code> en dos pasadas deterministas y verifica identidad SHA-256.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] space-y-2">
                  <div>
                    <div className="text-slate-500">Pasada 1 SHA-256</div>
                    <div className="text-slate-200 break-all">{invarianceData.fixedPoint.pass1Hash}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Pasada 2 SHA-256</div>
                    <div className="text-slate-200 break-all">{invarianceData.fixedPoint.pass2Hash}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    Invariancia Interna Canónica
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono ${
                      invarianceData.invariance.invariance_non_trivial
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {invarianceData.invariance.invariance_non_trivial
                      ? 'NO TRIVIAL = TRUE'
                      : 'FALLO'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{invarianceData.invariance.framing}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-slate-500">Auto-regeneración</div>
                    <div className="text-lg font-mono text-emerald-300">
                      {invarianceData.invariance.canonical.self_regeneration_rate.toFixed(6)}
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-slate-500">Invariancia por tríada</div>
                    <div className="text-lg font-mono text-emerald-300">
                      {String(invarianceData.invariance.canonical.triad_index_invariance)}
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-slate-500">Reconstrucción LOO (13 folds)</div>
                    <div className="text-lg font-mono text-emerald-300">
                      {String(invarianceData.invariance.canonical.subset_reconstruction)} (
                      {invarianceData.invariance.canonical.loo_folds_checked}/13)
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="text-slate-500">Autonomía medible</div>
                    <div className="text-lg font-mono text-emerald-300">
                      {String(invarianceData.invariance.canonical.autonomy_measurable)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Control Negativo Interactivo (Detección de Corrupción)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Sin control negativo, un 1.0 podría ser tautología. Selecciona un candidato (0–389) para
                    corromper su relación y comprobar que las métricas detectan la anomalía.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-mono">Arista #</label>
                  <input
                    type="number"
                    min={0}
                    max={389}
                    value={corruptIdx}
                    onChange={(e) => runInvarianceWithCorruption(Math.max(0, Math.min(389, Number(e.target.value))))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  />
                  <button
                    onClick={() => runInvarianceWithCorruption(corruptIdx)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-medium hover:bg-amber-500/30 cursor-pointer"
                  >
                    Corromper & Probar
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="md:col-span-2">
                  <div className="text-slate-500 mb-1">Mutación aplicada</div>
                  <div className="font-mono text-amber-200">
                    {invarianceData.invariance.negative_control.description}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Tasa tras corrupción</div>
                  <div className="font-mono text-lg text-rose-300">
                    {invarianceData.invariance.negative_control.corrupted_self_regeneration_rate.toFixed(6)}
                  </div>
                  <div className="text-slate-500 text-[11px]">389/390 = 0.997436</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">¿Detecta corrupción?</div>
                  <div className="font-mono text-lg text-emerald-300">
                    {String(invarianceData.invariance.negative_control.detects_corruption)}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    LOO L13: {String(invarianceData.invariance.negative_control.corrupted_subset_reconstruction)}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'eval' && evalData && editedAnnotations && liveReport && (
          <div className="space-y-6">
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Fleiss&apos; κ</div>
                <div className="text-2xl font-semibold font-mono text-sky-300 mt-1">
                  {liveReport.fleiss_kappa !== null ? liveReport.fleiss_kappa.toFixed(4) : 'N/A'}
                </div>
                <div className="text-[11px] text-slate-500">acuerdo interanotador</div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Ítems en κ</div>
                <div className="text-2xl font-semibold font-mono text-white mt-1">
                  {liveReport.n_pairs_in_kappa} / {liveReport.n_pairs_total}
                </div>
                <div className="text-[11px] text-slate-500">
                  incompletos: {liveReport.n_pairs_incomplete}
                </div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Unanimidad</div>
                <div className="text-2xl font-semibold font-mono text-emerald-300 mt-1">
                  {liveReport.unanimous_fraction !== null
                    ? `${(liveReport.unanimous_fraction * 100).toFixed(1)}%`
                    : 'N/A'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {liveReport.unanimous_count} / {liveReport.n_pairs_in_kappa} pares
                </div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-400">Acuerdo post-hoc reglas</div>
                <div className="text-2xl font-semibold font-mono text-amber-300 mt-1">
                  {liveReport.posthoc_agreement_with_rule_reference !== null
                    ? `${(liveReport.posthoc_agreement_with_rule_reference * 100).toFixed(1)}%`
                    : 'N/A'}
                </div>
                <div className="text-[11px] text-slate-500">
                  sobre {liveReport.n_posthoc_comparable} comparables
                </div>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div className="text-xs text-slate-400">Restaurar datos publicados</div>
                <button
                  onClick={resetAnnotations}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                >
                  Reiniciar protocolo
                </button>
              </div>
            </section>

            <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Instrumento de Evaluación Independiente (14 pares × 3 anotadores)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{liveReport.policy}</p>
                </div>
                <button
                  type="button"
                  onClick={downloadEvalAuditJson}
                  className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border border-sky-500/35 text-xs font-medium transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar JSON (Auditoría)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
                {Object.entries(evalData.annotations.annotator_profiles).map(([aid, prof]) => (
                  <div key={aid} className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
                    <span className="font-mono text-sky-300 font-semibold">{aid}: </span>
                    <span className="text-slate-400">{prof}</span>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 pr-2 font-mono">Par</th>
                      <th className="py-2 px-2">Conceptos</th>
                      <th className="py-2 px-2">Tipo</th>
                      {editedAnnotations.annotators.map((aid) => (
                        <th key={aid} className="py-2 px-2 font-mono">
                          {aid}
                        </th>
                      ))}
                      <th className="py-2 px-2">Mayoría</th>
                      <th className="py-2 pl-2">Regla ref.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {editedAnnotations.items.map((item) => {
                      const pairInfo = evalData.pairs.find((p) => p.id === item.id);
                      const ref = evalData.ruleReference[item.id];
                      const maj = liveReport.majority_labels_in_kappa[item.id] ?? 'excluido';
                      return (
                        <tr key={item.id} className="hover:bg-slate-800/30">
                          <td className="py-2 pr-2 font-mono text-sky-300 font-medium">{item.id}</td>
                          <td className="py-2 px-2 text-slate-200">
                            {pairInfo ? `${pairInfo.source_label} ↔ ${pairInfo.target_label}` : item.id}
                          </td>
                          <td className="py-2 px-2 font-mono text-slate-400">{item.kind ?? '—'}</td>
                          {editedAnnotations.annotators.map((aid) => {
                            const val = item.annotations[aid];
                            return (
                              <td key={aid} className="py-2 px-2">
                                <select
                                  value={val ?? '__null__'}
                                  onChange={(e) => updateEvalAnnotation(item.id, aid, e.target.value)}
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200"
                                >
                                  <option value="none">none</option>
                                  <option value="mirrorOf">mirrorOf</option>
                                  <option value="creates">creates</option>
                                  <option value="unsure">unsure</option>
                                  <option value="__null__">null</option>
                                </select>
                              </td>
                            );
                          })}
                          <td className="py-2 px-2">
                            <RelationBadge relation={maj} />
                          </td>
                          <td className="py-2 pl-2 font-mono text-slate-400">
                            {ref?.rule_label ?? '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'domain' && domainData && quizData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-400" />
                    {domainData.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{domainData.note}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    OK: {domainData.ok}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    WARN: {domainData.warn}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    FAIL: {domainData.fail}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {domainData.pairs.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-white">
                        <span className="font-mono text-sky-300 mr-2">{p.id}</span>
                        {p.source_label} → {p.target_label}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono ${
                          p.status === 'OK'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : p.status === 'WARN'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {p.status === 'WARN' && <AlertTriangle className="w-3 h-3" />}
                        {p.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <span>
                        nodos: {p.suggested_nodes.source} ({p.source_node_label}) →{' '}
                        {p.suggested_nodes.target} ({p.target_node_label})
                      </span>
                      <span>· propuesta:</span>
                      <RelationBadge relation={p.relation} />
                      <span>· gold:</span>
                      <RelationBadge relation={p.gold_relation ?? 'none'} />
                    </div>
                    <p className="text-slate-300">{p.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {quizData.title}
                </h2>
                <HelpCircle className="w-4 h-4 text-slate-500" />
              </div>

              <div className="space-y-4">
                {quizData.questions.map((q) => {
                  const res = quizScore?.results.find((r) => r.id === q.id);
                  return (
                    <div
                      key={q.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 text-xs space-y-2.5"
                    >
                      <div className="font-medium text-white">
                        <span className="font-mono text-sky-300 mr-1.5">{q.id}.</span>
                        {q.prompt}
                      </div>
                      <div className="space-y-1.5">
                        {Object.entries(q.options).map(([optKey, optText]) => (
                          <label
                            key={optKey}
                            className="flex items-start gap-2 cursor-pointer text-slate-300 hover:text-white"
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={optKey}
                              checked={quizAnswers[q.id] === optKey}
                              onChange={() =>
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: optKey }))
                              }
                              className="mt-0.5 accent-sky-400"
                            />
                            <span>
                              <strong className="font-mono text-slate-400 mr-1">{optKey})</strong>
                              {optText}
                            </span>
                          </label>
                        ))}
                      </div>
                      {res && (
                        <div
                          className={`p-2 rounded border ${
                            res.ok
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          }`}
                        >
                          <div className="font-mono font-semibold mb-0.5">
                            {res.ok ? 'OK' : `Incorrecto (esperado: ${res.expected})`}
                          </div>
                          <div>{res.rationale}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={submitQuiz}
                  className="px-4 py-2 rounded-lg bg-sky-500/20 text-sky-200 border border-sky-500/40 text-xs font-semibold hover:bg-sky-500/30 cursor-pointer"
                >
                  Evaluar respuestas
                </button>
                {quizScore && (
                  <span className="font-mono text-sm text-white">
                    Puntuación: {quizScore.correct}/{quizScore.total}
                  </span>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
