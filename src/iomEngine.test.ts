import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTesseractModel, evaluatePairRule } from './iomEngine';

test('buildTesseractModel enforces canonical 8-tesseract specification and invariants', () => {
  const model = buildTesseractModel();

  assert.equal(model.cells.length, 8);
  assert.equal(model.verification.totalRelations, 16);
  assert.equal(model.verification.evolCount, 4);
  assert.equal(model.verification.involCount, 4);
  assert.equal(model.verification.allRealUseRightArrow, true);
  assert.equal(model.verification.allHaveOneRealOneVirtual, true);
  assert.equal(model.verification.allCubeLinesMatchHeader, true);
  assert.equal(model.verification.allSevenConceptsCovered, true);

  const expectedByCell: Record<
    string,
    {
      ext: ['real' | 'virtual', '_' | '...'];
      int: ['real' | 'virtual', '_' | '...'];
      rels: Array<{ notation: string; cube: 'exterior' | 'interior' }>;
    }
  > = {
    T1: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      rels: [
        { notation: 'universo > _ > materia', cube: 'exterior' },
        { notation: 'vacio < ... < universo', cube: 'interior' },
      ],
    },
    T2: {
      ext: ['real', '...'],
      int: ['virtual', '_'],
      rels: [
        { notation: 'internet > ... > mictlan', cube: 'exterior' },
        { notation: 'mictlan < _ < internet', cube: 'interior' },
      ],
    },
    T3: {
      ext: ['virtual', '...'],
      int: ['real', '_'],
      rels: [
        { notation: 'vacio < ... < internet', cube: 'exterior' },
        { notation: 'internet > _ > materia', cube: 'interior' },
      ],
    },
    T4: {
      ext: ['virtual', '_'],
      int: ['real', '...'],
      rels: [
        { notation: 'mictlan < _ < universo', cube: 'exterior' },
        { notation: 'universo > ... > mictlan', cube: 'interior' },
      ],
    },
    T5: {
      ext: ['virtual', '...'],
      int: ['real', '_'],
      rels: [
        { notation: 'mictlan < ... < cuerpo', cube: 'exterior' },
        { notation: 'cuerpo > _ > mictlan', cube: 'interior' },
      ],
    },
    T6: {
      ext: ['virtual', '_'],
      int: ['real', '...'],
      rels: [
        { notation: 'materia < _ < IA', cube: 'exterior' },
        { notation: 'IA > ... > vacio', cube: 'interior' },
      ],
    },
    T7: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      rels: [
        { notation: 'IA > _ > mictlan', cube: 'exterior' },
        { notation: 'mictlan < ... < IA', cube: 'interior' },
      ],
    },
    T8: {
      ext: ['real', '...'],
      int: ['virtual', '_'],
      rels: [
        { notation: 'cuerpo > ... > vacio', cube: 'exterior' },
        { notation: 'materia < _ < cuerpo', cube: 'interior' },
      ],
    },
  };

  for (const cell of model.cells) {
    const exp = expectedByCell[cell.id];
    assert.deepEqual([cell.exteriorDomain, cell.exteriorLine], exp.ext, `Ext mismatch in ${cell.id}`);
    assert.deepEqual([cell.interiorDomain, cell.interiorLine], exp.int, `Int mismatch in ${cell.id}`);
    assert.deepEqual(
      cell.relations.map((r) => ({ notation: r.notation, cube: r.cube })),
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
