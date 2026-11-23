import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTesseractModel, evaluatePairRule } from './iomEngine';

test('buildTesseractModel enforces canonical 8-tesseract specification and invariants', () => {
  const model = buildTesseractModel();

  assert.equal(model.instruction.assetPath, '/assets/aistudio/IMG_20261123_031910_595b8f79.jpg');
  assert.equal(
    model.instruction.mirrorAssetPath,
    '/assets/aistudio/TSRIMG_20261123_023812_55e05147.jpg'
  );
  assert.equal(
    model.instruction.parityMirrorAssetPath,
    '/assets/aistudio/IMG_20261123_025743_a2265a38.jpg'
  );
  assert.equal(
    model.instruction.analysisAssetPath,
    '/assets/aistudio/IMG_20261123_015713_b7332827.jpg'
  );
  assert.equal(
    model.instruction.monochromeAssetPath,
    '/assets/aistudio/TSST_20261123_003603_de3cb84c.jpg'
  );
  assert.equal(model.instruction.pdfPath, '/assets/aistudio/1000000566_f7cafcef.pdf');
  assert.equal(model.cells.length, 8);
  assert.equal(model.analysisChains.length, 4);
  assert.equal(model.parityMirrorChains.length, 4);
  assert.equal(model.mirrorChains.length, 4);
  assert.equal(model.mirrorReflectedChains.length, 4);
  assert.equal(model.verification.totalRelations, 16);
  assert.equal(model.verification.realArrowCount, 8);
  assert.equal(model.verification.virtualArrowCount, 8);
  assert.equal(model.verification.continuousExtCount, 4);
  assert.equal(model.verification.dashedExtCount, 4);
  assert.equal(model.verification.allRealUseRightArrow, true);
  assert.equal(model.verification.allHaveOneRealOneVirtual, true);
  assert.equal(model.verification.allHaveOneContinuousOneDashed, true);
  assert.equal(model.verification.allCubeLinesMatchHeader, true);
  assert.equal(model.verification.allAnalysisChainsBalanced, true);
  assert.equal(model.verification.allParityMirrorChainsBalanced, true);
  assert.equal(model.verification.allMirrorChainsBalanced, true);
  assert.equal(model.verification.allMirrorReflectedChainsBalanced, true);
  assert.equal(model.verification.allConceptsCovered, true);
  assert.equal(model.verification.allCubeLabelsCovered, true);

  const expectedByCell: Record<
    string,
    {
      ext: [string, '_' | '...', string, string, string, string];
      int: [string, '_' | '...', string, string, string, string];
      rels: Array<{
        notation: string;
        cube: 'exterior' | 'interior';
        cubeLabel: string;
        analysisChain: string;
        mirrorChain: string;
        parityMirrorChain: string;
        mirrorReflectedChain: string;
      }>;
    }
  > = {
    T1: {
      ext: ['real', '_', 'azul', 'azul', 'rojo', 'rojo'],
      int: ['virtual', '...', 'amarillo', 'amarillo', 'verde', 'verde'],
      rels: [
        { notation: 'cuerpo > _ > universo', cube: 'exterior', cubeLabel: 'real', analysisChain: 'azul', mirrorChain: 'azul', parityMirrorChain: 'rojo', mirrorReflectedChain: 'rojo' },
        { notation: 'internet < ... < IA', cube: 'interior', cubeLabel: 'virtual', analysisChain: 'amarillo', mirrorChain: 'amarillo', parityMirrorChain: 'verde', mirrorReflectedChain: 'verde' },
      ],
    },
    T2: {
      ext: ['vacío', '...', 'rojo', 'verde', 'azul', 'amarillo'],
      int: ['materia', '_', 'verde', 'rojo', 'amarillo', 'azul'],
      rels: [
        { notation: 'individualidad < ... < totalidad', cube: 'exterior', cubeLabel: 'vacío', analysisChain: 'rojo', mirrorChain: 'verde', parityMirrorChain: 'azul', mirrorReflectedChain: 'amarillo' },
        { notation: 'totalidad > _ > individualidad', cube: 'interior', cubeLabel: 'materia', analysisChain: 'verde', mirrorChain: 'rojo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'azul' },
      ],
    },
    T3: {
      ext: ['vacío', '...', 'azul', 'verde', 'rojo', 'amarillo'],
      int: ['materia', '_', 'amarillo', 'rojo', 'verde', 'azul'],
      rels: [
        { notation: 'totalidad > ... > individualidad', cube: 'exterior', cubeLabel: 'vacío', analysisChain: 'azul', mirrorChain: 'verde', parityMirrorChain: 'rojo', mirrorReflectedChain: 'amarillo' },
        { notation: 'individualidad < _ < totalidad', cube: 'interior', cubeLabel: 'materia', analysisChain: 'amarillo', mirrorChain: 'rojo', parityMirrorChain: 'verde', mirrorReflectedChain: 'azul' },
      ],
    },
    T4: {
      ext: ['real', '_', 'rojo', 'azul', 'azul', 'rojo'],
      int: ['virtual', '...', 'verde', 'amarillo', 'amarillo', 'verde'],
      rels: [
        { notation: 'universo < _ < cuerpo', cube: 'exterior', cubeLabel: 'real', analysisChain: 'rojo', mirrorChain: 'azul', parityMirrorChain: 'azul', mirrorReflectedChain: 'rojo' },
        { notation: 'IA > ... > internet', cube: 'interior', cubeLabel: 'virtual', analysisChain: 'verde', mirrorChain: 'amarillo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'verde' },
      ],
    },
    T5: {
      ext: ['totalidad', '...', 'verde', 'rojo', 'amarillo', 'azul'],
      int: ['individualidad', '_', 'rojo', 'verde', 'azul', 'amarillo'],
      rels: [
        { notation: 'cuerpo < _ < universo', cube: 'interior', cubeLabel: 'individualidad', analysisChain: 'rojo', mirrorChain: 'verde', parityMirrorChain: 'azul', mirrorReflectedChain: 'amarillo' },
        { notation: 'internet > ... > IA', cube: 'exterior', cubeLabel: 'totalidad', analysisChain: 'verde', mirrorChain: 'rojo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'azul' },
      ],
    },
    T6: {
      ext: ['evolución', '_', 'amarillo', 'amarillo', 'verde', 'verde'],
      int: ['involución', '...', 'azul', 'azul', 'rojo', 'rojo'],
      rels: [
        { notation: 'individualidad > ... > totalidad', cube: 'interior', cubeLabel: 'involución', analysisChain: 'azul', mirrorChain: 'azul', parityMirrorChain: 'rojo', mirrorReflectedChain: 'rojo' },
        { notation: 'totalidad < _ < individualidad', cube: 'exterior', cubeLabel: 'evolución', analysisChain: 'amarillo', mirrorChain: 'amarillo', parityMirrorChain: 'verde', mirrorReflectedChain: 'verde' },
      ],
    },
    T7: {
      ext: ['evolución', '_', 'verde', 'amarillo', 'amarillo', 'verde'],
      int: ['involución', '...', 'rojo', 'azul', 'azul', 'rojo'],
      rels: [
        { notation: 'totalidad < ... < individualidad', cube: 'interior', cubeLabel: 'involución', analysisChain: 'rojo', mirrorChain: 'azul', parityMirrorChain: 'azul', mirrorReflectedChain: 'rojo' },
        { notation: 'individualidad > _ > totalidad', cube: 'exterior', cubeLabel: 'evolución', analysisChain: 'verde', mirrorChain: 'amarillo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'verde' },
      ],
    },
    T8: {
      ext: ['totalidad', '...', 'amarillo', 'rojo', 'verde', 'azul'],
      int: ['individualidad', '_', 'azul', 'verde', 'rojo', 'amarillo'],
      rels: [
        { notation: 'universo > _ > cuerpo', cube: 'interior', cubeLabel: 'individualidad', analysisChain: 'azul', mirrorChain: 'verde', parityMirrorChain: 'rojo', mirrorReflectedChain: 'amarillo' },
        { notation: 'IA < ... < internet', cube: 'exterior', cubeLabel: 'totalidad', analysisChain: 'amarillo', mirrorChain: 'rojo', parityMirrorChain: 'verde', mirrorReflectedChain: 'azul' },
      ],
    },
  };

  for (const cell of model.cells) {
    const exp = expectedByCell[cell.id];
    assert.deepEqual(
      [
        cell.exteriorLabel,
        cell.exteriorLine,
        cell.exteriorChain,
        cell.exteriorMirrorChain,
        cell.exteriorParityMirrorChain,
        cell.exteriorMirrorReflectedChain,
      ],
      exp.ext,
      `Ext mismatch in ${cell.id}`
    );
    assert.deepEqual(
      [
        cell.interiorLabel,
        cell.interiorLine,
        cell.interiorChain,
        cell.interiorMirrorChain,
        cell.interiorParityMirrorChain,
        cell.interiorMirrorReflectedChain,
      ],
      exp.int,
      `Int mismatch in ${cell.id}`
    );
    assert.deepEqual(
      cell.relations.map((r) => ({
        notation: r.notation,
        cube: r.cube,
        cubeLabel: r.cubeLabel,
        analysisChain: r.analysisChain,
        mirrorChain: r.mirrorChain,
        parityMirrorChain: r.parityMirrorChain,
        mirrorReflectedChain: r.mirrorReflectedChain,
      })),
      exp.rels,
      `Relations mismatch in ${cell.id}`
    );
  }
});

test('evaluatePairRule derives expected mirrorOf and creates relations', () => {
  const mirrorCheck = evaluatePairRule('T01_adv_P0', 'T01_ret_P2');
  assert.equal(mirrorCheck.relation, 'mirrorOf');

  const createsCheck = evaluatePairRule('T01_adv_P0', 'T01_ret_P1');
  assert.equal(createsCheck.relation, 'creates');
});
