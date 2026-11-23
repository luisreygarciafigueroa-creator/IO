import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTesseractModel, evaluatePairRule } from './iomEngine';

test('buildTesseractModel enforces canonical 8-tesseract specification and invariants', () => {
  const model = buildTesseractModel();

  assert.equal(model.instruction.assetPath, '/assets/aistudio/TSST_20261123_003603_de3cb84c.jpg');
  assert.equal(model.instruction.pdfPath, '/assets/aistudio/1000000566_f7cafcef.pdf');
  assert.equal(model.cells.length, 8);
  assert.equal(model.verification.totalRelations, 16);
  assert.equal(model.verification.realArrowCount, 8);
  assert.equal(model.verification.virtualArrowCount, 8);
  assert.equal(model.verification.continuousExtCount, 4);
  assert.equal(model.verification.dashedExtCount, 4);
  assert.equal(model.verification.allRealUseRightArrow, true);
  assert.equal(model.verification.allHaveOneRealOneVirtual, true);
  assert.equal(model.verification.allHaveOneContinuousOneDashed, true);
  assert.equal(model.verification.allCubeLinesMatchHeader, true);
  assert.equal(model.verification.allConceptsCovered, true);
  assert.equal(model.verification.allCubeLabelsCovered, true);

  const expectedByCell: Record<
    string,
    {
      ext: [string, '_' | '...'];
      int: [string, '_' | '...'];
      rels: Array<{ notation: string; cube: 'exterior' | 'interior'; cubeLabel: string }>;
    }
  > = {
    T1: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      rels: [
        { notation: 'cuerpo > _ > universo', cube: 'exterior', cubeLabel: 'real' },
        { notation: 'internet < ... < IA', cube: 'interior', cubeLabel: 'virtual' },
      ],
    },
    T2: {
      ext: ['vacío', '...'],
      int: ['materia', '_'],
      rels: [
        { notation: 'individualidad < ... < totalidad', cube: 'exterior', cubeLabel: 'vacío' },
        { notation: 'totalidad > _ > individualidad', cube: 'interior', cubeLabel: 'materia' },
      ],
    },
    T3: {
      ext: ['vacío', '...'],
      int: ['materia', '_'],
      rels: [
        { notation: 'totalidad > ... > individualidad', cube: 'exterior', cubeLabel: 'vacío' },
        { notation: 'individualidad < _ < totalidad', cube: 'interior', cubeLabel: 'materia' },
      ],
    },
    T4: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      rels: [
        { notation: 'universo < _ < cuerpo', cube: 'exterior', cubeLabel: 'real' },
        { notation: 'IA > ... > internet', cube: 'interior', cubeLabel: 'virtual' },
      ],
    },
    T5: {
      ext: ['totalidad', '...'],
      int: ['individualidad', '_'],
      rels: [
        { notation: 'cuerpo < _ < universo', cube: 'interior', cubeLabel: 'individualidad' },
        { notation: 'internet > ... > IA', cube: 'exterior', cubeLabel: 'totalidad' },
      ],
    },
    T6: {
      ext: ['evolución', '_'],
      int: ['involución', '...'],
      rels: [
        { notation: 'individualidad > ... > totalidad', cube: 'interior', cubeLabel: 'involución' },
        { notation: 'totalidad < _ < individualidad', cube: 'exterior', cubeLabel: 'evolución' },
      ],
    },
    T7: {
      ext: ['evolución', '_'],
      int: ['involución', '...'],
      rels: [
        { notation: 'totalidad < ... < individualidad', cube: 'interior', cubeLabel: 'involución' },
        { notation: 'individualidad > _ > totalidad', cube: 'exterior', cubeLabel: 'evolución' },
      ],
    },
    T8: {
      ext: ['totalidad', '...'],
      int: ['individualidad', '_'],
      rels: [
        { notation: 'universo > _ > cuerpo', cube: 'interior', cubeLabel: 'individualidad' },
        { notation: 'IA < ... < internet', cube: 'exterior', cubeLabel: 'totalidad' },
      ],
    },
  };

  for (const cell of model.cells) {
    const exp = expectedByCell[cell.id];
    assert.deepEqual([cell.exteriorLabel, cell.exteriorLine], exp.ext, `Ext mismatch in ${cell.id}`);
    assert.deepEqual([cell.interiorLabel, cell.interiorLine], exp.int, `Int mismatch in ${cell.id}`);
    assert.deepEqual(
      cell.relations.map((r) => ({ notation: r.notation, cube: r.cube, cubeLabel: r.cubeLabel })),
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
