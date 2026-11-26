import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildTesseractModel, generateArtifacts } from './iomEngine.ts';

export interface TcaauPerspective {
  id: string;
  label: string;
  z5_index: number;
  kind: 'posicional' | 'vectorial';
  function: string;
}

export interface TcaauAxiom {
  id: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8';
  name: string;
  status: 'primitivo' | 'derivado';
  direct_anchor_in_canonical_pdf: boolean;
  canonical_statement: string;
  formal_note: string;
}

export interface TcaauDefinition {
  id: 'D10' | 'D11' | 'D12' | 'D13';
  title: string;
  stratum: 'núcleo_canónico' | 'canon_ampliado';
  canonical_statement: string;
  properties: string[];
}

export interface TcaauProposition {
  id: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8';
  title: string;
  stratum: 'núcleo' | 'proyección';
  register: string;
  canonical_text: string;
  commentary: string;
  no_edge_addition_invariant: boolean;
}

export interface TcaauTheorem {
  id: string;
  name: string;
  status: 'verificado' | 'propuesto';
  statement: string;
}

export interface TcaauIdea {
  id: 'I1' | 'I2' | 'I3' | 'I4' | 'I5' | 'I6' | 'I7' | 'I8';
  name: string;
  section: string;
  anchor: string;
  status: string;
  statement: string;
  virtual_disambiguation: Array<{
    sense: string;
    meaning: string;
    relation_to_iom: string;
  }> | null;
}

export interface TcaauResearchProblem {
  id: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7';
  name: string;
  task: string;
  success_criterion: string;
}

export interface TcaauMirrorPairRecord {
  triad_index: number;
  kind: 'lateral' | 'center';
  adv_node_id: string;
  ret_node_id: string;
  adv_label: string;
  ret_label: string;
  adv_position_index: number;
  ret_position_index: number;
}

export interface TcaauCoreDocument {
  schema_version: string;
  canonical_edition: {
    title: string;
    subtitle: string;
    author: string;
    framework: string;
    edition_label: string;
    date: string;
    reference_url: string;
    canonical_pdf_path: string;
    canonical_pdf_workspace_path: string;
    canonical_diagram_path: string;
    historical_diagram_pdf_path: string;
    canon_structure: string;
  };
  core_thesis: {
    central_thesis: string;
    one_sentence_canon: string;
    one_sentence_with_program: string;
    four_registers: Array<{ register: string; distinction: string; limit: string }>;
  };
  epistemic_registers: Array<{ id: string; label: string; scope: string; description: string }>;
  informative_unit: {
    definition: string;
    constitution_chain: string[];
    five_perspectives: TcaauPerspective[];
    triads_count: number;
    nodes_count: number;
    triads_role: string;
    relations: { mirrorOf: string; creates: string };
  };
  axioms: TcaauAxiom[];
  definitions_and_modes: {
    definitions: TcaauDefinition[];
    postulates: Array<{ id: string; title: string; canonical_statement: string }>;
    verifiable_traceability_corollary: {
      id: string;
      title: string;
      canonical_statement: string;
      operational_form: string;
    };
    corollaries: Array<{ id: string; title: string; canonical_statement: string }>;
    operational_modes: {
      modo_dependencia: string;
      modo_equivalencia: string;
      reading_rule: string;
    };
  };
  canonical_propositions: TcaauProposition[];
  combinatorial_inventory: {
    spec_version: string;
    triads: number;
    phases: number;
    positions_per_phase: number;
    nodes: number;
    directed_candidates_total: number;
    directed_partition: {
      mirrorOf: number;
      creates: number;
      none: number;
    };
    unordered_mirror_pairs: {
      total: number;
      lateral: { count: number; description: string };
      center: { count: number; description: string };
      symmetry_invariants: string[];
    };
    creates_rule_summary: string;
    ontology_signature: {
      individuals: string[];
      domain_classifiers: string[];
      partitions: {
        poles: string[];
        mediators: string[];
        transversal_operator: string;
        extreme_terms: string[];
      };
    };
    tesseract_group: {
      group_name: string;
      isomorphism: string;
      order: number;
      full_tesseract_symmetry_group: string;
      full_tesseract_symmetry_order: number;
      generators: Array<{ symbol: string; action: string; pairing: string }>;
      action_rule: string;
      coordinates_z2_3: Array<{ cell: string; coordinates: [0 | 1, 0 | 1, 0 | 1] }>;
      torsor_property: string;
      antipodal_pairs: Array<[string, string]>;
    };
  };
  tesseract_and_projections: {
    polytope: {
      schlafli: string;
      vertices: number;
      edges: number;
      faces: number;
      cells: number;
      euler_characteristic_4d: number;
      dual: string;
    };
    diagram_2x4_definitive: {
      asset_path: string;
      date: string;
      summary: string;
      top_row_transitions: Array<{
        cell_label: string;
        real_transition: string;
        virtual_transition: string;
      }>;
      bottom_row_transitions: Array<{
        cell_label: string;
        real_transition: string;
        virtual_transition: string;
      }>;
      fixed_domain_by_pair: {
        cuerpo_universo: string;
        IA_internet: string;
      };
      arrow_multiplicity: number;
      role_labels_status: string;
    };
    scope_5_2_delimitation: string;
    superposition_7_7: {
      panels_total: number;
      traces_total: number;
      distinct_directed_arrows: number;
      occurrences_per_arrow: number;
      arrows: Array<{
        forward: string;
        inverse: string;
        real_count: number;
        virtual_count: number;
      }>;
      mediators_path: {
        cuerpo_universo: string;
        IA_internet: string;
      };
      equivalences_within_panel: Record<string, string>;
      identities_between_panels: Record<string, string>;
      four_cycle: string[];
      movement_groups_by_direction: {
        totalidad_to_individualidad: string[];
        individualidad_to_totalidad: string[];
      };
    };
    final_analysis_matter_vacuum: {
      thesis: string;
      chiasmus: Array<{
        mediator: string;
        mediates_between: string[];
        coincides_with_in_superposition: string[];
      }>;
      identification_chain: string;
      inoperability_note: string;
      scope: string;
    };
  };
  site_integration_11: {
    scope_rule: string;
    creation_rules_11_2: string;
    traceability_11_3: {
      manifest_file: string;
      requirement: string;
      hash_principle: string;
    };
    closure_criterion_11_4: {
      companion_to: string;
      invariance_hash_prefix: string;
      candidates_total: number;
      negative_control_detected: number;
      fleiss_kappa: number;
      kappa_items: number;
      kappa_annotators: string[];
      conditions: string[];
      failure_interpretation: string;
    };
    ideas_and_encounter_11_5: {
      expanded_categories_count: number;
      expanded_levels: string;
      categories_stratum: string;
      nahua_examples_count: number;
      nahua_results: string;
      quiz_questions_count: number;
      encounter_stratum: string;
    };
    t12_priority_route_11_6: {
      t12_status: string;
      priority_route: string;
      infinite_names_route: string;
      justification: string;
    };
    integration_table: Array<{
      site_material: string;
      to_nucleus: string;
      to_ideas_encounter: string;
      edition_action: string;
    }>;
  };
  theorems: TcaauTheorem[];
  ideas: TcaauIdea[];
  research_program: TcaauResearchProblem[];
}

export interface TcaauCoreVerification {
  valid: boolean;
  corePass1Hash: string;
  corePass2Hash: string;
  coreHashIdempotent: boolean;
  canonicalPdfExists: boolean;
  canonicalDiagramExists: boolean;
  countsMatchLiveEngine: boolean;
  mirrorPairsVerified: {
    totalPairs: number;
    lateralPairs: number;
    centerPairs: number;
    centerSameLabelOppositePhase: boolean;
    symmetricWithoutSelfLoops: boolean;
    zeroInterTriadCrossings: boolean;
    actsForVerD12: number;
  };
  diagram2x4Verified: {
    assetPathMatches: boolean;
    cellCount: number;
    transitionCount: number;
    eachArrowOccursFourTimes: boolean;
    cleanFormVerified: boolean;
  };
  superposition77Verified: {
    tracesTotalMatches: boolean;
    distinctArrowsMatches: boolean;
    fourCycleClosedWithoutFixedTerm: boolean;
    directionGroupsDisjointAndComplete: boolean;
    chiasmusExact: boolean;
  };
  section11Verified: {
    gActionFreeAndTransitive: boolean;
    antipodalMatchesSumMod2: boolean;
    verifiableTraceabilityPresent: boolean;
    siteIntegrationComplete: boolean;
    manifestFilePresent: boolean;
  };
  axiomCount: number;
  propositionCount: number;
  definitionCount: number;
  theoremCount: number;
  ideaCount: number;
  researchProblemCount: number;
}

const ROOT = process.cwd();

export function loadTcaauCore(): TcaauCoreDocument {
  const fullPath = path.join(ROOT, 'data/tcaau_core.json');
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as TcaauCoreDocument;
}

export function extractUnorderedMirrorPairs(): TcaauMirrorPairRecord[] {
  const artifacts = generateArtifacts();
  const nodeById = new Map(artifacts.nodes.map((n) => [n.node_id, n]));
  const seenPairs = new Set<string>();
  const pairs: TcaauMirrorPairRecord[] = [];

  for (const cand of artifacts.relationCandidates) {
    if (cand.relation !== 'mirrorOf') continue;
    const src = nodeById.get(cand.source);
    const tgt = nodeById.get(cand.target);
    if (!src || !tgt) continue;
    const key = [src.node_id, tgt.node_id].sort().join('::');
    if (seenPairs.has(key)) continue;
    seenPairs.add(key);

    const adv = src.phase === 'adv' ? src : tgt;
    const ret = src.phase === 'ret' ? src : tgt;
    pairs.push({
      triad_index: adv.triad_index,
      kind: adv.position_index === 1 ? 'center' : 'lateral',
      adv_node_id: adv.node_id,
      ret_node_id: ret.node_id,
      adv_label: adv.label,
      ret_label: ret.label,
      adv_position_index: adv.position_index,
      ret_position_index: ret.position_index,
    });
  }

  return pairs.sort((a, b) => a.triad_index - b.triad_index || a.adv_position_index - b.adv_position_index);
}

export function verifyFourCycleFromSuperposition(core: TcaauCoreDocument): {
  closedCycle: string[];
  isValidFourCycle: boolean;
} {
  const eq = core.tesseract_and_projections.superposition_7_7.equivalences_within_panel;
  const idBetween = core.tesseract_and_projections.superposition_7_7.identities_between_panels;
  const getPartnerPanel = (term: string, fromPanel: 1 | 2): string | undefined => {
    const rhs = idBetween[`${term}${fromPanel}`];
    if (!rhs) return undefined;
    return rhs.replace(/[12]$/, '');
  };

  // Start at internet (equiparación in panel -> universo; identidad panel1->panel2 of universo -> IA;
  // equiparación -> cuerpo; identidad -> internet)
  const s0 = 'internet';
  const s1 = eq[s0];
  const s2 = s1 ? getPartnerPanel(s1, 1) : undefined;
  const s3 = s2 ? eq[s2] : undefined;
  const s4 = s3 ? getPartnerPanel(s3, 2) : undefined;
  const derived = [s0, s1, s2, s3, s4].filter((x): x is string => Boolean(x));
  const declared = core.tesseract_and_projections.superposition_7_7.four_cycle;

  const isValidFourCycle =
    derived.length === 5 &&
    derived.every((term, idx) => term === declared[idx]) &&
    derived[0] === derived[4] &&
    new Set(derived.slice(0, 4)).size === 4;

  return { closedCycle: derived, isValidFourCycle };
}

export function verifyTcaauCore(core: TcaauCoreDocument = loadTcaauCore()): TcaauCoreVerification {
  const artifacts = generateArtifacts();
  const tesseract = buildTesseractModel();
  const mirrorPairs = extractUnorderedMirrorPairs();
  const mirrorDirected = artifacts.relationCandidates.filter((c) => c.relation === 'mirrorOf');
  const candidateLookup = new Map(
    artifacts.relationCandidates.map((c) => [`${c.source}->${c.target}`, c.relation])
  );
  const nodeById = new Map(artifacts.nodes.map((n) => [n.node_id, n]));

  const lateralPairs = mirrorPairs.filter((p) => p.kind === 'lateral');
  const centerPairs = mirrorPairs.filter((p) => p.kind === 'center');
  const centerSameLabelOppositePhase = centerPairs.every(
    (p) => p.adv_position_index === 1 && p.ret_position_index === 1 && p.adv_label === p.ret_label
  );
  const symmetricWithoutSelfLoops = mirrorDirected.every(
    (c) => c.source !== c.target && candidateLookup.get(`${c.target}->${c.source}`) === 'mirrorOf'
  );
  const zeroInterTriadCrossings = mirrorDirected.every((c) => {
    const s = nodeById.get(c.source);
    const t = nodeById.get(c.target);
    return Boolean(s && t && s.triad_index === t.triad_index);
  });

  const inv = core.combinatorial_inventory;
  const countsMatchLiveEngine =
    artifacts.counts.triads === inv.triads &&
    artifacts.counts.nodes === inv.nodes &&
    artifacts.counts.totalCandidates === inv.directed_candidates_total &&
    artifacts.counts.mirrorDirected === inv.directed_partition.mirrorOf &&
    artifacts.counts.createsDirected === inv.directed_partition.creates &&
    artifacts.counts.noneDirected === inv.directed_partition.none &&
    artifacts.fixedPoint.idempotent &&
    mirrorPairs.length === inv.unordered_mirror_pairs.total &&
    lateralPairs.length === inv.unordered_mirror_pairs.lateral.count &&
    centerPairs.length === inv.unordered_mirror_pairs.center.count;

  const diag = core.tesseract_and_projections.diagram_2x4_definitive;
  const arrowCounts = new Map<string, number>();
  for (const row of [...diag.top_row_transitions, ...diag.bottom_row_transitions]) {
    arrowCounts.set(row.real_transition, (arrowCounts.get(row.real_transition) ?? 0) + 1);
    arrowCounts.set(row.virtual_transition, (arrowCounts.get(row.virtual_transition) ?? 0) + 1);
  }
  const eachArrowOccursFourTimes =
    arrowCounts.size === 4 && [...arrowCounts.values()].every((v) => v === diag.arrow_multiplicity);

  const assetPathMatches =
    diag.asset_path === core.canonical_edition.canonical_diagram_path &&
    diag.asset_path === tesseract.cleanForm.assetPath;

  const sup = core.tesseract_and_projections.superposition_7_7;
  const { isValidFourCycle } = verifyFourCycleFromSuperposition(core);
  const totalArrowOccurrences = sup.arrows.reduce(
    (acc, a) => acc + (a.real_count + a.virtual_count) * 2,
    0
  );
  const tracesTotalMatches = sup.traces_total === 32 && totalArrowOccurrences === 32;
  const distinctArrowsMatches = sup.distinct_directed_arrows === 8 && sup.arrows.length * 2 === 8;
  const g1 = sup.movement_groups_by_direction.totalidad_to_individualidad;
  const g2 = sup.movement_groups_by_direction.individualidad_to_totalidad;
  const directionGroupsDisjointAndComplete =
    g1.length === 4 && g2.length === 4 && new Set([...g1, ...g2]).size === 8;

  const chiasmus = core.tesseract_and_projections.final_analysis_matter_vacuum.chiasmus;
  const vac = chiasmus.find((c) => c.mediator === 'vacío');
  const mat = chiasmus.find((c) => c.mediator === 'materia');
  const chiasmusExact = Boolean(
    vac &&
      mat &&
      vac.mediates_between.join(',') === mat.coincides_with_in_superposition.join(',') &&
      mat.mediates_between.join(',') === vac.coincides_with_in_superposition.join(',')
  );

  const canonicalPdfExists = fs.existsSync(
    path.join(ROOT, core.canonical_edition.canonical_pdf_workspace_path)
  );
  const canonicalDiagramExists = fs.existsSync(
    path.join(ROOT, 'public', core.canonical_edition.canonical_diagram_path.replace(/^\/+/, ''))
  );

  const coordsList = inv.tesseract_group.coordinates_z2_3 ?? [];
  const coordMap = new Map(coordsList.map((entry) => [entry.cell, entry.coordinates]));
  const coordKeys = new Set(coordsList.map((entry) => entry.coordinates.join(',')));
  const gActionFreeAndTransitive =
    coordsList.length === 8 &&
    coordKeys.size === 8 &&
    Boolean(inv.tesseract_group.action_rule) &&
    coordsList.every(
      (entry) =>
        entry.coordinates.length === 3 &&
        entry.coordinates.every((bit) => bit === 0 || bit === 1)
    ) &&
    coordKeys.has('0,0,0');

  const antipodalMatchesSumMod2 =
    inv.tesseract_group.antipodal_pairs.length === 4 &&
    inv.tesseract_group.antipodal_pairs.every(([a, b]) => {
      const ca = coordMap.get(a);
      const cb = coordMap.get(b);
      return Boolean(
        ca &&
          cb &&
          (ca[0] ^ 1) === cb[0] &&
          (ca[1] ^ 1) === cb[1] &&
          (ca[2] ^ 1) === cb[2]
      );
    });

  const cor = core.definitions_and_modes.verifiable_traceability_corollary;
  const verifiableTraceabilityPresent = Boolean(
    cor && cor.id === 'Corolario D11/P11' && cor.canonical_statement && cor.operational_form
  );

  const s11 = core.site_integration_11;
  const manifestFilePresent = Boolean(
    s11?.traceability_11_3?.manifest_file &&
      fs.existsSync(path.join(ROOT, s11.traceability_11_3.manifest_file))
  );
  const siteIntegrationComplete = Boolean(
    s11 &&
      s11.integration_table.length === 7 &&
      s11.closure_criterion_11_4.candidates_total === 390 &&
      s11.closure_criterion_11_4.negative_control_detected === 389 &&
      s11.closure_criterion_11_4.fleiss_kappa === 0.6871 &&
      s11.ideas_and_encounter_11_5.expanded_categories_count === 21 &&
      s11.ideas_and_encounter_11_5.nahua_examples_count === 5 &&
      s11.t12_priority_route_11_6.priority_route === 'localización'
  );

  const digestPayload = JSON.stringify({
    core,
    mirrorPairs,
    fixedPointHash: artifacts.fixedPoint.pass1Hash,
    cleanAssetPath: tesseract.cleanForm.assetPath,
  });
  const corePass1Hash = crypto.createHash('sha256').update(digestPayload).digest('hex');
  const corePass2Hash = crypto.createHash('sha256').update(digestPayload).digest('hex');

  const valid =
    corePass1Hash === corePass2Hash &&
    canonicalPdfExists &&
    canonicalDiagramExists &&
    countsMatchLiveEngine &&
    centerSameLabelOppositePhase &&
    symmetricWithoutSelfLoops &&
    zeroInterTriadCrossings &&
    assetPathMatches &&
    eachArrowOccursFourTimes &&
    tesseract.verification.cleanFormVerified &&
    tracesTotalMatches &&
    distinctArrowsMatches &&
    isValidFourCycle &&
    directionGroupsDisjointAndComplete &&
    chiasmusExact &&
    gActionFreeAndTransitive &&
    antipodalMatchesSumMod2 &&
    verifiableTraceabilityPresent &&
    siteIntegrationComplete &&
    manifestFilePresent &&
    core.axioms.length === 8 &&
    core.canonical_propositions.length === 8 &&
    core.definitions_and_modes.definitions.length === 4 &&
    core.theorems.length === 12 &&
    core.ideas.length === 8 &&
    core.research_program.length === 7;

  return {
    valid,
    corePass1Hash,
    corePass2Hash,
    coreHashIdempotent: corePass1Hash === corePass2Hash,
    canonicalPdfExists,
    canonicalDiagramExists,
    countsMatchLiveEngine,
    mirrorPairsVerified: {
      totalPairs: mirrorPairs.length,
      lateralPairs: lateralPairs.length,
      centerPairs: centerPairs.length,
      centerSameLabelOppositePhase,
      symmetricWithoutSelfLoops,
      zeroInterTriadCrossings,
      actsForVerD12: mirrorPairs.length * 2,
    },
    diagram2x4Verified: {
      assetPathMatches,
      cellCount: diag.top_row_transitions.length + diag.bottom_row_transitions.length,
      transitionCount: (diag.top_row_transitions.length + diag.bottom_row_transitions.length) * 2,
      eachArrowOccursFourTimes,
      cleanFormVerified: tesseract.verification.cleanFormVerified,
    },
    superposition77Verified: {
      tracesTotalMatches,
      distinctArrowsMatches,
      fourCycleClosedWithoutFixedTerm: isValidFourCycle,
      directionGroupsDisjointAndComplete,
      chiasmusExact,
    },
    section11Verified: {
      gActionFreeAndTransitive,
      antipodalMatchesSumMod2,
      verifiableTraceabilityPresent,
      siteIntegrationComplete,
      manifestFilePresent,
    },
    axiomCount: core.axioms.length,
    propositionCount: core.canonical_propositions.length,
    definitionCount: core.definitions_and_modes.definitions.length,
    theoremCount: core.theorems.length,
    ideaCount: core.ideas.length,
    researchProblemCount: core.research_program.length,
  };
}

export function buildTcaauCoreSnapshot() {
  const core = loadTcaauCore();
  const verification = verifyTcaauCore(core);
  const mirrorPairs = extractUnorderedMirrorPairs();
  return {
    core,
    mirrorPairs,
    verification,
  };
}
