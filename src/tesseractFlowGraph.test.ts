import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTesseractModel } from './iomEngine';
import {
  buildSchlegelCubeWireframe,
  buildTesseractFlowGraph,
  computeBezierEdgeGeometry,
} from './tesseractFlowGraph';

test('buildTesseractFlowGraph extracts all 6 nodes and 16 directed edges in two dual-pair columns', () => {
  const tesseractData = buildTesseractModel();
  const graph = buildTesseractFlowGraph(tesseractData, 'all');

  assert.equal(graph.nodes.length, 6);
  assert.equal(graph.edges.length, 16);

  const cuerpo = graph.nodes.find((n) => n.id === 'cuerpo');
  const universo = graph.nodes.find((n) => n.id === 'universo');
  const individualidad = graph.nodes.find((n) => n.id === 'individualidad');
  const totalidad = graph.nodes.find((n) => n.id === 'totalidad');

  assert.ok(cuerpo && universo && individualidad && totalidad);
  assert.notEqual(cuerpo.tier, universo.tier);
  assert.notEqual(individualidad.tier, totalidad.tier);
  assert.equal(cuerpo.inDegree, 2);
  assert.equal(cuerpo.outDegree, 2);
  assert.equal(individualidad.inDegree, 4);
  assert.equal(individualidad.outDegree, 4);
});

test('buildTesseractFlowGraph filters real (>), virtual (<), and the 4 connection-analysis color chains accurately', () => {
  const tesseractData = buildTesseractModel();

  const realGraph = buildTesseractFlowGraph(tesseractData, 'real');
  assert.equal(realGraph.edges.length, 8);
  assert.ok(realGraph.edges.every((e) => e.domain === 'real' && e.rel.arrow === '>'));

  const virtualGraph = buildTesseractFlowGraph(tesseractData, 'virtual');
  assert.equal(virtualGraph.edges.length, 8);
  assert.ok(virtualGraph.edges.every((e) => e.domain === 'virtual' && e.rel.arrow === '<'));

  for (const chainId of ['azul', 'amarillo', 'rojo', 'verde'] as const) {
    for (const parityMode of [
      'parity',
      'parityMirror',
      'parityPolarSwap',
      'parityPolarMirror',
      'paritySetTop',
      'paritySetBottom',
    ] as const) {
      const parityGraph = buildTesseractFlowGraph(tesseractData, chainId, parityMode);
      assert.equal(parityGraph.edges.length, 4);
      assert.ok(parityGraph.edges.every((e) => e.rel.chains?.[parityMode] === chainId));
      const distinctCombos = new Set(parityGraph.edges.map((e) => `${e.rel.cube}:${e.rel.line}`));
      assert.equal(distinctCombos.size, 4);
    }

    for (const mirrorMode of [
      'mirror',
      'mirrorReflected',
      'mirrorFrameSwap',
      'mirrorFrameSwapMirror',
      'mirrorSetTop',
      'mirrorSetTopMirror',
    ] as const) {
      const mirrorGraph = buildTesseractFlowGraph(tesseractData, chainId, mirrorMode);
      assert.equal(mirrorGraph.edges.length, 4);
      assert.ok(mirrorGraph.edges.every((e) => e.rel.chains?.[mirrorMode] === chainId));
      assert.equal(mirrorGraph.edges.filter((e) => e.rel.arrow === '>').length, 2);
      assert.equal(mirrorGraph.edges.filter((e) => e.rel.cube === 'exterior').length, 2);
    }
  }
});

test('buildTesseractFlowGraph separates parallel edges between the same concept pair', () => {
  const tesseractData = buildTesseractModel();
  const graph = buildTesseractFlowGraph(tesseractData, 'all');

  const cuerpoUniverso = graph.edges.filter(
    (e) =>
      (e.source === 'cuerpo' && e.target === 'universo') ||
      (e.source === 'universo' && e.target === 'cuerpo')
  );
  assert.equal(cuerpoUniverso.length, 4);
  const offsets = new Set(cuerpoUniverso.map((e) => e.curveOffset));
  assert.equal(offsets.size, 4);

  const geom = computeBezierEdgeGeometry(
    { x: 116, y: 72 },
    { x: 464, y: 72 },
    cuerpoUniverso[0].curveOffset
  );
  assert.ok(geom.path.startsWith('M '));
  assert.ok(Number.isFinite(geom.labelX));
  assert.ok(Number.isFinite(geom.labelY));
});

test('buildTesseractFlowGraph adapts dynamically to custom tesseractData inputs', () => {
  const customGraph = buildTesseractFlowGraph({
    concepts: ['alfa', 'beta', 'gamma'],
    cells: [
      {
        id: 'C1',
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
          {
            left: 'alfa',
            arrow: '>',
            line: '_',
            right: 'beta',
            domain: 'real',
            cube: 'exterior',
            cubeLabel: 'real',
            notation: 'alfa > _ > beta',
          },
          {
            left: 'gamma',
            arrow: '<',
            line: '...',
            right: 'beta',
            domain: 'virtual',
            cube: 'interior',
            cubeLabel: 'virtual',
            notation: 'gamma < ... < beta',
          },
        ],
        neighbors: { horizontal: 'C1', vertical: 'C1', diagonal: 'C1' },
      },
    ],
  });

  assert.equal(customGraph.nodes.length, 3);
  assert.equal(customGraph.edges.length, 2);
  const beta = customGraph.nodes.find((n) => n.id === 'beta');
  assert.ok(beta);
  // beta has both in-degree (from alfa) and out-degree (to gamma), so it is placed in intermediate tier 1
  assert.equal(beta.tier, 1);
  assert.equal(beta.inDegree, 1);
  assert.equal(beta.outDegree, 1);
});

test('buildSchlegelCubeWireframe generates 16 vertices and 32 tesseract edges, and T1–T8 match updated cube line rules', () => {
  const geom = buildSchlegelCubeWireframe(210, 134, 54, 24, 22, -13);
  assert.equal(geom.exteriorVertices.length, 8);
  assert.equal(geom.interiorVertices.length, 8);
  assert.equal(geom.exteriorEdges.length, 12);
  assert.equal(geom.interiorEdges.length, 12);
  assert.equal(geom.strutEdges.length, 8);

  const model = buildTesseractModel();
  assert.equal(model.cells.length, 8);

  const [t1, t2, t3, t4, t5, t6, t7, t8] = model.cells;

  assert.deepEqual([t1.exteriorLabel, t1.exteriorLine, t1.interiorLabel, t1.interiorLine], ['real', '_', 'virtual', '...']);
  assert.deepEqual([t2.exteriorLabel, t2.exteriorLine, t2.interiorLabel, t2.interiorLine], ['vacío', '...', 'materia', '_']);
  assert.deepEqual([t3.exteriorLabel, t3.exteriorLine, t3.interiorLabel, t3.interiorLine], ['vacío', '...', 'materia', '_']);
  assert.deepEqual([t4.exteriorLabel, t4.exteriorLine, t4.interiorLabel, t4.interiorLine], ['real', '_', 'virtual', '...']);
  assert.deepEqual([t5.exteriorLabel, t5.exteriorLine, t5.interiorLabel, t5.interiorLine], ['totalidad', '...', 'individualidad', '_']);
  assert.deepEqual([t6.exteriorLabel, t6.exteriorLine, t6.interiorLabel, t6.interiorLine], ['evolución', '_', 'involución', '...']);
  assert.deepEqual([t7.exteriorLabel, t7.exteriorLine, t7.interiorLabel, t7.interiorLine], ['evolución', '_', 'involución', '...']);
  assert.deepEqual([t8.exteriorLabel, t8.exteriorLine, t8.interiorLabel, t8.interiorLine], ['totalidad', '...', 'individualidad', '_']);

  assert.equal(model.verification.allRealUseRightArrow, true);
  assert.equal(model.verification.allHaveOneRealOneVirtual, true);
  assert.equal(model.verification.allHaveOneContinuousOneDashed, true);
  assert.equal(model.verification.allCubeLinesMatchHeader, true);
  assert.equal(model.verification.allConceptsCovered, true);
  assert.equal(model.verification.allCubeLabelsCovered, true);
  assert.equal(model.verification.cleanFormVerified, true);
});

test('buildTesseractFlowGraph supports definitive clean mode with real/virtual edge symmetry and quadrant polarity nodes', () => {
  const tesseractData = buildTesseractModel();
  const cleanAll = buildTesseractFlowGraph(tesseractData, 'all', 'clean');

  assert.equal(cleanAll.nodes.length, 6);
  assert.equal(cleanAll.edges.length, 16);

  const cuerpo = cleanAll.nodes.find((n) => n.id === 'cuerpo');
  const universo = cleanAll.nodes.find((n) => n.id === 'universo');
  const internet = cleanAll.nodes.find((n) => n.id === 'internet');
  const ia = cleanAll.nodes.find((n) => n.id === 'IA');
  const individualidad = cleanAll.nodes.find((n) => n.id === 'individualidad');
  const totalidad = cleanAll.nodes.find((n) => n.id === 'totalidad');

  assert.ok(cuerpo && universo && internet && ia && individualidad && totalidad);
  assert.equal(cuerpo.inDegree, 4);
  assert.equal(cuerpo.outDegree, 4);
  assert.equal(universo.inDegree, 4);
  assert.equal(universo.outDegree, 4);
  assert.equal(internet.inDegree, 4);
  assert.equal(internet.outDegree, 4);
  assert.equal(ia.inDegree, 4);
  assert.equal(ia.outDegree, 4);

  assert.equal(individualidad.tier, 1);
  assert.equal(individualidad.role, 'aislado');
  assert.equal(individualidad.inDegree, 0);
  assert.equal(individualidad.outDegree, 0);
  assert.equal(totalidad.tier, 1);
  assert.equal(totalidad.role, 'aislado');

  const cleanReal = buildTesseractFlowGraph(tesseractData, 'real', 'clean');
  assert.equal(cleanReal.edges.length, 8);
  assert.ok(cleanReal.edges.every((e) => e.rel.line === '_' && e.domain === 'real'));

  const cleanVirtual = buildTesseractFlowGraph(tesseractData, 'virtual', 'clean');
  assert.equal(cleanVirtual.edges.length, 8);
  assert.ok(cleanVirtual.edges.every((e) => e.rel.line === '...' && e.domain === 'virtual'));
});
