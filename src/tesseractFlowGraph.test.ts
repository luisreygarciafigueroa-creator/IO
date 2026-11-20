import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTesseractModel } from './iomEngine';
import {
  buildSchlegelCubeWireframe,
  buildTesseractFlowGraph,
  computeBezierEdgeGeometry,
} from './tesseractFlowGraph';

test('buildTesseractFlowGraph extracts all 7 nodes and 16 directed edges from tesseractData', () => {
  const tesseractData = buildTesseractModel();
  const graph = buildTesseractFlowGraph(tesseractData, 'all');

  assert.equal(graph.nodes.length, 7);
  assert.equal(graph.edges.length, 16);

  const mictlan = graph.nodes.find((n) => n.id === 'mictlan');
  assert.ok(mictlan);
  assert.equal(mictlan.inDegree, 8);
  assert.equal(mictlan.outDegree, 0);
  assert.equal(mictlan.involCount, 8);
  assert.equal(mictlan.evolCount, 0);
});

test('buildTesseractFlowGraph filters evolucion and involucion transitions accurately', () => {
  const tesseractData = buildTesseractModel();

  const evolGraph = buildTesseractFlowGraph(tesseractData, 'evolucion');
  assert.equal(evolGraph.edges.length, 8);
  assert.ok(evolGraph.edges.every((e) => e.perspective === 'evolucion'));
  assert.ok(evolGraph.edges.every((e) => e.target === 'materia' || e.target === 'vacio'));

  const involGraph = buildTesseractFlowGraph(tesseractData, 'involucion');
  assert.equal(involGraph.edges.length, 8);
  assert.ok(involGraph.edges.every((e) => e.perspective === 'involucion'));
  assert.ok(involGraph.edges.every((e) => e.target === 'mictlan'));
});

test('buildTesseractFlowGraph separates parallel edges between the same concept pair', () => {
  const tesseractData = buildTesseractModel();
  const graph = buildTesseractFlowGraph(tesseractData, 'involucion');

  const internetToMictlan = graph.edges.filter(
    (e) => e.source === 'internet' && e.target === 'mictlan'
  );
  assert.equal(internetToMictlan.length, 2);
  assert.notEqual(internetToMictlan[0].curveOffset, internetToMictlan[1].curveOffset);

  const geom = computeBezierEdgeGeometry(
    { x: 112, y: 150 },
    { x: 468, y: 316 },
    internetToMictlan[0].curveOffset
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
        perspective: 'evolucion',
        exteriorDomain: 'real',
        exteriorLine: '_',
        interiorDomain: 'virtual',
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
            notation: 'alfa > _ > beta',
          },
          {
            left: 'gamma',
            arrow: '<',
            line: '...',
            right: 'beta',
            domain: 'virtual',
            cube: 'interior',
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

test('buildSchlegelCubeWireframe generates 16 vertices and 32 tesseract edges, and T1–T8 match explicit cube line rules', () => {
  const geom = buildSchlegelCubeWireframe(210, 134, 54, 24, 22, -13);
  assert.equal(geom.exteriorVertices.length, 8);
  assert.equal(geom.interiorVertices.length, 8);
  assert.equal(geom.exteriorEdges.length, 12);
  assert.equal(geom.interiorEdges.length, 12);
  assert.equal(geom.strutEdges.length, 8);

  const model = buildTesseractModel();
  assert.equal(model.cells.length, 8);

  const t1 = model.cells[0];
  assert.equal(t1.interiorDomain, 'virtual');
  assert.equal(t1.interiorLine, '...');
  assert.equal(t1.exteriorDomain, 'real');
  assert.equal(t1.exteriorLine, '_');

  const t2 = model.cells[1];
  assert.equal(t2.perspective, 'involucion');
  assert.equal(t2.interiorDomain, 'virtual');
  assert.equal(t2.interiorLine, '_');
  assert.equal(t2.exteriorDomain, 'real');
  assert.equal(t2.exteriorLine, '...');

  const t3 = model.cells[2];
  assert.equal(t3.perspective, 'evolucion');
  assert.equal(t3.interiorDomain, 'real');
  assert.equal(t3.interiorLine, '_');
  assert.equal(t3.exteriorDomain, 'virtual');
  assert.equal(t3.exteriorLine, '...');

  const t4 = model.cells[3];
  assert.equal(t4.perspective, 'involucion');
  assert.equal(t4.interiorDomain, 'real');
  assert.equal(t4.interiorLine, '...');
  assert.equal(t4.exteriorDomain, 'virtual');
  assert.equal(t4.exteriorLine, '_');

  const t5 = model.cells[4];
  assert.equal(t5.perspective, 'involucion');
  assert.equal(t5.interiorDomain, 'real');
  assert.equal(t5.interiorLine, '_');
  assert.equal(t5.exteriorDomain, 'virtual');
  assert.equal(t5.exteriorLine, '...');

  const t6 = model.cells[5];
  assert.equal(t6.perspective, 'evolucion');
  assert.equal(t6.interiorDomain, 'real');
  assert.equal(t6.interiorLine, '...');
  assert.equal(t6.exteriorDomain, 'virtual');
  assert.equal(t6.exteriorLine, '_');

  const t7 = model.cells[6];
  assert.equal(t7.perspective, 'involucion');
  assert.equal(t7.interiorDomain, 'virtual');
  assert.equal(t7.interiorLine, '...');
  assert.equal(t7.exteriorDomain, 'real');
  assert.equal(t7.exteriorLine, '_');

  const t8 = model.cells[7];
  assert.equal(t8.perspective, 'evolucion');
  assert.equal(t8.interiorDomain, 'virtual');
  assert.equal(t8.interiorLine, '_');
  assert.equal(t8.exteriorDomain, 'real');
  assert.equal(t8.exteriorLine, '...');

  assert.equal(model.verification.allRealUseRightArrow, true);
  assert.equal(model.verification.allHaveOneRealOneVirtual, true);
  assert.equal(model.verification.allCubeLinesMatchHeader, true);
});
