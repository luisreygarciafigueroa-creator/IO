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
    model.instruction.mirrorFrameSwapAssetPath,
    '/assets/aistudio/IMG_20261123_063146_8d038bdc.jpg'
  );
  assert.equal(
    model.instruction.parityPolarMirrorAssetPath,
    '/assets/aistudio/IMG_20261123_070052_2e86be46.jpg'
  );
  assert.equal(
    model.instruction.parityPolarSwapAssetPath,
    '/assets/aistudio/IMG_20261123_064557_52d8695d.jpg'
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
    model.instruction.compositeSetAssetPath,
    '/assets/aistudio/IMG_20261124_000207_382065f8.jpg'
  );
  assert.equal(
    model.instruction.cleanAssetPath,
    '/assets/aistudio/6dr__1__0283eca1.jpg'
  );
  assert.equal(
    model.instruction.cleanPriorAssetPath,
    '/assets/aistudio/6dr_36f66e7c.jpg'
  );
  assert.equal(
    model.instruction.cleanTsst13AssetPath,
    '/assets/aistudio/TSST__13__43e94964.jpg'
  );
  assert.equal(
    model.instruction.cleanLegacyAssetPath,
    '/assets/aistudio/TSST_20261123_003603_357ce661.jpg'
  );
  assert.equal(
    model.instruction.monochromeAssetPath,
    '/assets/aistudio/TSST_20261123_003603_de3cb84c.jpg'
  );
  assert.equal(model.instruction.pdfPath, '/assets/aistudio/1000000566_f7cafcef.pdf');
  assert.equal(model.instruction.colorAssets.length, 12);
  assert.equal(model.cells.length, 8);
  assert.equal(model.colorings.length, 12);
  assert.equal(model.analysisChains.length, 4);
  assert.equal(model.parityMirrorChains.length, 4);
  assert.equal(model.mirrorChains.length, 4);
  assert.equal(model.mirrorReflectedChains.length, 4);
  assert.equal(model.verification.totalRelations, 16);
  assert.equal(model.verification.realArrowCount, 8);
  assert.equal(model.verification.virtualArrowCount, 8);
  assert.equal(model.verification.continuousExtCount, 4);
  assert.equal(model.verification.dashedExtCount, 4);
  assert.equal(model.verification.coloringsCount, 12);
  assert.equal(model.verification.allRealUseRightArrow, true);
  assert.equal(model.verification.allHaveOneRealOneVirtual, true);
  assert.equal(model.verification.allHaveOneContinuousOneDashed, true);
  assert.equal(model.verification.allCubeLinesMatchHeader, true);
  assert.equal(model.verification.allAnalysisChainsBalanced, true);
  assert.equal(model.verification.allParityMirrorChainsBalanced, true);
  assert.equal(model.verification.allMirrorChainsBalanced, true);
  assert.equal(model.verification.allMirrorReflectedChainsBalanced, true);
  assert.equal(model.verification.allColoringInvolutionsExact, true);
  assert.equal(model.verification.allColoringsClosed, true);
  assert.equal(model.verification.allConceptsCovered, true);
  assert.equal(model.verification.allCubeLabelsCovered, true);
  assert.equal(model.verification.cleanFormCellCount, 8);
  assert.equal(model.verification.cleanFormTransitionCount, 16);
  assert.equal(model.verification.cleanFormAllRealSolidVirtualDashed, true);
  assert.equal(model.verification.cleanFormAllHaveOneRightOneLeft, true);
  assert.equal(model.verification.cleanFormOmitsPolarityLabels, true);
  assert.equal(model.verification.cleanFormAllHorizontalMirrorsExact, true);
  assert.equal(model.verification.cleanFormAllVerticalMirrorsExact, true);
  assert.equal(model.verification.cleanFormVerified, true);

  const expectedByCell: Record<
    string,
    {
      ext: [string, '_' | '...', string, string, string, string];
      int: [string, '_' | '...', string, string, string, string];
      extNew: [string, string, string];
      intNew: [string, string, string];
      rels: Array<{
        notation: string;
        cube: 'exterior' | 'interior';
        cubeLabel: string;
        analysisChain: string;
        mirrorChain: string;
        parityMirrorChain: string;
        mirrorReflectedChain: string;
        mirrorFrameSwap: string;
        parityPolarMirror: string;
        parityPolarSwap: string;
      }>;
    }
  > = {
    T1: {
      ext: ['real', '_', 'azul', 'azul', 'rojo', 'rojo'],
      int: ['virtual', '...', 'amarillo', 'amarillo', 'verde', 'verde'],
      extNew: ['amarillo', 'rojo', 'amarillo'],
      intNew: ['azul', 'verde', 'azul'],
      rels: [
        { notation: 'cuerpo > _ > universo', cube: 'exterior', cubeLabel: 'real', analysisChain: 'azul', mirrorChain: 'azul', parityMirrorChain: 'rojo', mirrorReflectedChain: 'rojo', mirrorFrameSwap: 'amarillo', parityPolarMirror: 'rojo', parityPolarSwap: 'amarillo' },
        { notation: 'internet < ... < IA', cube: 'interior', cubeLabel: 'virtual', analysisChain: 'amarillo', mirrorChain: 'amarillo', parityMirrorChain: 'verde', mirrorReflectedChain: 'verde', mirrorFrameSwap: 'azul', parityPolarMirror: 'verde', parityPolarSwap: 'azul' },
      ],
    },
    T2: {
      ext: ['vacío', '...', 'rojo', 'verde', 'azul', 'amarillo'],
      int: ['materia', '_', 'verde', 'rojo', 'amarillo', 'azul'],
      extNew: ['verde', 'amarillo', 'rojo'],
      intNew: ['rojo', 'azul', 'verde'],
      rels: [
        { notation: 'individualidad < ... < totalidad', cube: 'exterior', cubeLabel: 'vacío', analysisChain: 'rojo', mirrorChain: 'verde', parityMirrorChain: 'azul', mirrorReflectedChain: 'amarillo', mirrorFrameSwap: 'verde', parityPolarMirror: 'amarillo', parityPolarSwap: 'rojo' },
        { notation: 'totalidad > _ > individualidad', cube: 'interior', cubeLabel: 'materia', analysisChain: 'verde', mirrorChain: 'rojo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'azul', mirrorFrameSwap: 'rojo', parityPolarMirror: 'azul', parityPolarSwap: 'verde' },
      ],
    },
    T3: {
      ext: ['vacío', '...', 'azul', 'verde', 'rojo', 'amarillo'],
      int: ['materia', '_', 'amarillo', 'rojo', 'verde', 'azul'],
      extNew: ['verde', 'rojo', 'amarillo'],
      intNew: ['rojo', 'verde', 'azul'],
      rels: [
        { notation: 'totalidad > ... > individualidad', cube: 'exterior', cubeLabel: 'vacío', analysisChain: 'azul', mirrorChain: 'verde', parityMirrorChain: 'rojo', mirrorReflectedChain: 'amarillo', mirrorFrameSwap: 'verde', parityPolarMirror: 'rojo', parityPolarSwap: 'amarillo' },
        { notation: 'individualidad < _ < totalidad', cube: 'interior', cubeLabel: 'materia', analysisChain: 'amarillo', mirrorChain: 'rojo', parityMirrorChain: 'verde', mirrorReflectedChain: 'azul', mirrorFrameSwap: 'rojo', parityPolarMirror: 'verde', parityPolarSwap: 'azul' },
      ],
    },
    T4: {
      ext: ['real', '_', 'rojo', 'azul', 'azul', 'rojo'],
      int: ['virtual', '...', 'verde', 'amarillo', 'amarillo', 'verde'],
      extNew: ['amarillo', 'amarillo', 'rojo'],
      intNew: ['azul', 'azul', 'verde'],
      rels: [
        { notation: 'universo < _ < cuerpo', cube: 'exterior', cubeLabel: 'real', analysisChain: 'rojo', mirrorChain: 'azul', parityMirrorChain: 'azul', mirrorReflectedChain: 'rojo', mirrorFrameSwap: 'amarillo', parityPolarMirror: 'amarillo', parityPolarSwap: 'rojo' },
        { notation: 'IA > ... > internet', cube: 'interior', cubeLabel: 'virtual', analysisChain: 'verde', mirrorChain: 'amarillo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'verde', mirrorFrameSwap: 'azul', parityPolarMirror: 'azul', parityPolarSwap: 'verde' },
      ],
    },
    T5: {
      ext: ['totalidad', '...', 'verde', 'rojo', 'amarillo', 'azul'],
      int: ['individualidad', '_', 'rojo', 'verde', 'azul', 'amarillo'],
      extNew: ['rojo', 'azul', 'verde'],
      intNew: ['verde', 'amarillo', 'rojo'],
      rels: [
        { notation: 'cuerpo < _ < universo', cube: 'interior', cubeLabel: 'individualidad', analysisChain: 'rojo', mirrorChain: 'verde', parityMirrorChain: 'azul', mirrorReflectedChain: 'amarillo', mirrorFrameSwap: 'verde', parityPolarMirror: 'amarillo', parityPolarSwap: 'rojo' },
        { notation: 'internet > ... > IA', cube: 'exterior', cubeLabel: 'totalidad', analysisChain: 'verde', mirrorChain: 'rojo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'azul', mirrorFrameSwap: 'rojo', parityPolarMirror: 'azul', parityPolarSwap: 'verde' },
      ],
    },
    T6: {
      ext: ['evolución', '_', 'amarillo', 'amarillo', 'verde', 'verde'],
      int: ['involución', '...', 'azul', 'azul', 'rojo', 'rojo'],
      extNew: ['azul', 'verde', 'azul'],
      intNew: ['amarillo', 'rojo', 'amarillo'],
      rels: [
        { notation: 'individualidad > ... > totalidad', cube: 'interior', cubeLabel: 'involución', analysisChain: 'azul', mirrorChain: 'azul', parityMirrorChain: 'rojo', mirrorReflectedChain: 'rojo', mirrorFrameSwap: 'amarillo', parityPolarMirror: 'rojo', parityPolarSwap: 'amarillo' },
        { notation: 'totalidad < _ < individualidad', cube: 'exterior', cubeLabel: 'evolución', analysisChain: 'amarillo', mirrorChain: 'amarillo', parityMirrorChain: 'verde', mirrorReflectedChain: 'verde', mirrorFrameSwap: 'azul', parityPolarMirror: 'verde', parityPolarSwap: 'azul' },
      ],
    },
    T7: {
      ext: ['evolución', '_', 'verde', 'amarillo', 'amarillo', 'verde'],
      int: ['involución', '...', 'rojo', 'azul', 'azul', 'rojo'],
      extNew: ['azul', 'azul', 'verde'],
      intNew: ['amarillo', 'amarillo', 'rojo'],
      rels: [
        { notation: 'totalidad < ... < individualidad', cube: 'interior', cubeLabel: 'involución', analysisChain: 'rojo', mirrorChain: 'azul', parityMirrorChain: 'azul', mirrorReflectedChain: 'rojo', mirrorFrameSwap: 'amarillo', parityPolarMirror: 'amarillo', parityPolarSwap: 'rojo' },
        { notation: 'individualidad > _ > totalidad', cube: 'exterior', cubeLabel: 'evolución', analysisChain: 'verde', mirrorChain: 'amarillo', parityMirrorChain: 'amarillo', mirrorReflectedChain: 'verde', mirrorFrameSwap: 'azul', parityPolarMirror: 'azul', parityPolarSwap: 'verde' },
      ],
    },
    T8: {
      ext: ['totalidad', '...', 'amarillo', 'rojo', 'verde', 'azul'],
      int: ['individualidad', '_', 'azul', 'verde', 'rojo', 'amarillo'],
      extNew: ['rojo', 'verde', 'azul'],
      intNew: ['verde', 'rojo', 'amarillo'],
      rels: [
        { notation: 'universo > _ > cuerpo', cube: 'interior', cubeLabel: 'individualidad', analysisChain: 'azul', mirrorChain: 'verde', parityMirrorChain: 'rojo', mirrorReflectedChain: 'amarillo', mirrorFrameSwap: 'verde', parityPolarMirror: 'rojo', parityPolarSwap: 'amarillo' },
        { notation: 'IA < ... < internet', cube: 'exterior', cubeLabel: 'totalidad', analysisChain: 'amarillo', mirrorChain: 'rojo', parityMirrorChain: 'verde', mirrorReflectedChain: 'azul', mirrorFrameSwap: 'rojo', parityPolarMirror: 'verde', parityPolarSwap: 'azul' },
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
        cell.exteriorChains.mirrorFrameSwap,
        cell.exteriorChains.parityPolarMirror,
        cell.exteriorChains.parityPolarSwap,
      ],
      exp.extNew,
      `Ext new colorings mismatch in ${cell.id}`
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
      [
        cell.interiorChains.mirrorFrameSwap,
        cell.interiorChains.parityPolarMirror,
        cell.interiorChains.parityPolarSwap,
      ],
      exp.intNew,
      `Int new colorings mismatch in ${cell.id}`
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
        mirrorFrameSwap: r.chains.mirrorFrameSwap,
        parityPolarMirror: r.chains.parityPolarMirror,
        parityPolarSwap: r.chains.parityPolarSwap,
      })),
      exp.rels,
      `Relations mismatch in ${cell.id}`
    );
  }

  const byColoringId = new Map(model.colorings.map((c) => [c.id, c]));
  for (const coloring of model.colorings) {
    assert.equal(coloring.balanced, true, `Coloring ${coloring.id} should be balanced`);
    const partner = byColoringId.get(coloring.mirrorPartnerId);
    assert.ok(partner, `Missing mirror partner for ${coloring.id}`);
    assert.equal(
      partner.mirrorPartnerId,
      coloring.id,
      `Partner link must be mutual between ${coloring.id} and ${partner.id}`
    );
    for (const cell of model.cells) {
      for (const rel of cell.relations) {
        const mapped = coloring.involutionMap[rel.chains[coloring.id]];
        assert.equal(
          mapped,
          rel.chains[coloring.mirrorPartnerId],
          `Involution mismatch for ${coloring.id} -> ${coloring.mirrorPartnerId} in ${cell.id}`
        );
      }
    }
  }

  // Spot-check the 5 new panels from IMG-000207 (#1, #2, #3, #6, #7) on T1 & T2
  const t1 = model.cells[0];
  const t2 = model.cells[1];
  assert.equal(t1.exteriorChains.mirrorSetTop, 'rojo');
  assert.equal(t1.interiorChains.mirrorSetTop, 'verde');
  assert.equal(t2.exteriorChains.mirrorSetTop, 'azul');
  assert.equal(t2.interiorChains.mirrorSetTop, 'amarillo');

  assert.equal(t1.exteriorChains.mirrorSetTopMirror, 'azul');
  assert.equal(t1.interiorChains.mirrorSetTopMirror, 'amarillo');
  assert.equal(t2.exteriorChains.mirrorSetTopMirror, 'rojo');
  assert.equal(t2.interiorChains.mirrorSetTopMirror, 'verde');

  assert.equal(t1.exteriorChains.mirrorFrameSwapMirror, 'verde');
  assert.equal(t1.interiorChains.mirrorFrameSwapMirror, 'rojo');
  assert.equal(t2.exteriorChains.mirrorFrameSwapMirror, 'amarillo');
  assert.equal(t2.interiorChains.mirrorFrameSwapMirror, 'azul');

  assert.equal(t1.exteriorChains.paritySetTop, 'verde');
  assert.equal(t1.interiorChains.paritySetTop, 'rojo');
  assert.equal(t2.exteriorChains.paritySetTop, 'amarillo');
  assert.equal(t2.interiorChains.paritySetTop, 'azul');

  assert.equal(t1.exteriorChains.paritySetBottom, 'amarillo');
  assert.equal(t1.interiorChains.paritySetBottom, 'azul');
  assert.equal(t2.exteriorChains.paritySetBottom, 'verde');
  assert.equal(t2.interiorChains.paritySetBottom, 'rojo');

  // Verify general & definitive closed form (6dr__1__0283eca1.jpg) & prior drafts
  assert.equal(model.cleanForm.assetPath, '/assets/aistudio/6dr__1__0283eca1.jpg');
  assert.equal(model.cleanForm.priorAssetPath, '/assets/aistudio/6dr_36f66e7c.jpg');
  assert.equal(model.cleanForm.tsst13AssetPath, '/assets/aistudio/TSST__13__43e94964.jpg');
  assert.equal(model.cleanForm.legacyAssetPath, '/assets/aistudio/TSST_20261123_003603_357ce661.jpg');
  assert.equal(model.cleanForm.assetTag, 'TSST-6dr-1 definitivo');
  assert.equal(model.cleanForm.cells.length, 8);
  const expectedClean: Record<
    string,
    {
      ext: ['real' | 'virtual', '_' | '...'];
      int: ['real' | 'virtual', '_' | '...'];
      notations: [string, string];
    }
  > = {
    T1: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      notations: ['cuerpo > _ > universo', 'IA < ... < internet'],
    },
    T2: {
      ext: ['virtual', '...'],
      int: ['real', '_'],
      notations: ['IA < ... < internet', 'cuerpo > _ > universo'],
    },
    T3: {
      ext: ['virtual', '...'],
      int: ['real', '_'],
      notations: ['internet > ... > IA', 'universo < _ < cuerpo'],
    },
    T4: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      notations: ['universo < _ < cuerpo', 'internet > ... > IA'],
    },
    T5: {
      ext: ['virtual', '...'],
      int: ['real', '_'],
      notations: ['IA > ... > internet', 'cuerpo < _ < universo'],
    },
    T6: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      notations: ['cuerpo < _ < universo', 'IA > ... > internet'],
    },
    T7: {
      ext: ['real', '_'],
      int: ['virtual', '...'],
      notations: ['universo > _ > cuerpo', 'internet < ... < IA'],
    },
    T8: {
      ext: ['virtual', '...'],
      int: ['real', '_'],
      notations: ['internet < ... < IA', 'universo > _ > cuerpo'],
    },
  };
  for (const cell of model.cleanForm.cells) {
    const exp = expectedClean[cell.id];
    assert.deepEqual([cell.exteriorLabel, cell.exteriorLine], exp.ext, `Clean ext mismatch in ${cell.id}`);
    assert.deepEqual([cell.interiorLabel, cell.interiorLine], exp.int, `Clean int mismatch in ${cell.id}`);
    assert.equal(cell.polarityLeft, undefined, `Clean polarityLeft should be omitted in ${cell.id}`);
    assert.equal(cell.polarityRight, undefined, `Clean polarityRight should be omitted in ${cell.id}`);
    assert.deepEqual(cell.relations.map((r) => r.notation), exp.notations, `Clean relations mismatch in ${cell.id}`);
    assert.ok(
      cell.relations.every((r) => r.leftPolarity === undefined && r.rightPolarity === undefined),
      `Clean endpoint polarities should be omitted in ${cell.id}`
    );
  }
});

test('evaluatePairRule derives expected mirrorOf and creates relations', () => {
  const mirrorCheck = evaluatePairRule('T01_adv_P0', 'T01_ret_P2');
  assert.equal(mirrorCheck.relation, 'mirrorOf');

  const createsCheck = evaluatePairRule('T01_adv_P0', 'T01_ret_P1');
  assert.equal(createsCheck.relation, 'creates');
});
