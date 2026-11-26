import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildTcaauCoreSnapshot,
  extractUnorderedMirrorPairs,
  loadTcaauCore,
  verifyFourCycleFromSuperposition,
  verifyTcaauCore,
} from './tcaauCore';

test('tcaauCore extracts complete canonical formal core (A1–A8, D10–D13, R1–R8, T1–T12, I1–I7, P1–P6)', () => {
  const core = loadTcaauCore();

  assert.equal(core.canonical_edition.canonical_pdf_path, '/assets/aistudio/Teor_a_Completa_TCAAU_2d30a1f1.pdf');
  assert.equal(core.canonical_edition.canonical_diagram_path, '/assets/aistudio/6dr__1__0283eca1.jpg');

  assert.deepEqual(
    core.axioms.map((a) => a.id),
    ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']
  );
  assert.equal(core.axioms.find((a) => a.id === 'A8')?.status, 'derivado');

  assert.deepEqual(
    core.definitions_and_modes.definitions.map((d) => d.id),
    ['D10', 'D11', 'D12', 'D13']
  );
  assert.deepEqual(
    core.definitions_and_modes.corollaries.map((c) => c.id),
    ['C15', 'C16', 'C17']
  );

  assert.deepEqual(
    core.canonical_propositions.map((r) => r.id),
    ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
  );
  assert.equal(
    core.canonical_propositions.filter((r) => r.stratum === 'núcleo').length,
    7
  );
  assert.equal(
    core.canonical_propositions.find((r) => r.id === 'R8')?.stratum,
    'proyección'
  );
  assert.ok(core.canonical_propositions.every((r) => r.no_edge_addition_invariant));

  assert.deepEqual(
    core.theorems.map((t) => t.id),
    ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
  );
  assert.equal(core.theorems.find((t) => t.id === 'T12')?.status, 'propuesto');

  assert.deepEqual(
    core.ideas.map((i) => i.id),
    ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7']
  );
  assert.equal(core.ideas.find((i) => i.id === 'I5')?.virtual_disambiguation?.length, 4);

  assert.deepEqual(
    core.research_program.map((p) => p.id),
    ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
  );
});

test('verifyTcaauCore confirms live agreement with iomEngine 78/390/39(26+13) and {4,3,3} clean 2x4 diagram', () => {
  const snapshot = buildTcaauCoreSnapshot();
  const v = verifyTcaauCore(snapshot.core);

  assert.equal(v.valid, true);
  assert.equal(v.coreHashIdempotent, true);
  assert.equal(v.canonicalPdfExists, true);
  assert.equal(v.canonicalDiagramExists, true);
  assert.equal(v.countsMatchLiveEngine, true);

  assert.equal(v.mirrorPairsVerified.totalPairs, 39);
  assert.equal(v.mirrorPairsVerified.lateralPairs, 26);
  assert.equal(v.mirrorPairsVerified.centerPairs, 13);
  assert.equal(v.mirrorPairsVerified.centerSameLabelOppositePhase, true);
  assert.equal(v.mirrorPairsVerified.symmetricWithoutSelfLoops, true);
  assert.equal(v.mirrorPairsVerified.zeroInterTriadCrossings, true);
  assert.equal(v.mirrorPairsVerified.actsForVerD12, 78);

  assert.equal(v.diagram2x4Verified.assetPathMatches, true);
  assert.equal(v.diagram2x4Verified.cellCount, 8);
  assert.equal(v.diagram2x4Verified.transitionCount, 16);
  assert.equal(v.diagram2x4Verified.eachArrowOccursFourTimes, true);
  assert.equal(v.diagram2x4Verified.cleanFormVerified, true);

  assert.equal(v.superposition77Verified.tracesTotalMatches, true);
  assert.equal(v.superposition77Verified.distinctArrowsMatches, true);
  assert.equal(v.superposition77Verified.fourCycleClosedWithoutFixedTerm, true);
  assert.equal(v.superposition77Verified.directionGroupsDisjointAndComplete, true);
  assert.equal(v.superposition77Verified.chiasmusExact, true);
});

test('extractUnorderedMirrorPairs produces 13 center eigenform pairs (I3) and §7.7 four-cycle closes cleanly', () => {
  const pairs = extractUnorderedMirrorPairs();
  const centerPairs = pairs.filter((p) => p.kind === 'center');
  assert.equal(centerPairs.length, 13);
  for (const cp of centerPairs) {
    assert.equal(cp.adv_position_index, 1);
    assert.equal(cp.ret_position_index, 1);
    assert.equal(cp.adv_label, cp.ret_label);
  }

  const cycleCheck = verifyFourCycleFromSuperposition(loadTcaauCore());
  assert.equal(cycleCheck.isValidFourCycle, true);
  assert.deepEqual(cycleCheck.closedCycle, ['internet', 'universo', 'IA', 'cuerpo', 'internet']);

  // Verify schema file is valid JSON Schema
  const schema = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data/tcaau_core.schema.json'), 'utf-8')
  ) as { $schema?: string; required?: string[] };
  assert.ok(schema.$schema?.includes('2020-12'));
  assert.ok(schema.required?.includes('canonical_propositions'));
});
