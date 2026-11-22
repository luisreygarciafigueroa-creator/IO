import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEvalAuditFilename,
  buildEvalAuditPayload,
  serializeEvalAuditPayload,
} from './evalAuditExport';

test('buildEvalAuditPayload preserves liveReport and editedAnnotations verbatim', () => {
  const liveReport = {
    status: 'completed',
    fleiss_kappa: 0.6871,
    n_pairs_in_kappa: 14,
  };
  const editedAnnotations = {
    annotators: ['A1', 'A2', 'A3'],
    items: [
      {
        id: 'P01',
        annotations: { A1: 'mirrorOf', A2: 'mirrorOf', A3: 'creates' },
      },
    ],
  };

  const payload = buildEvalAuditPayload(
    liveReport,
    editedAnnotations,
    '2026-11-20T18:30:00.000Z'
  );

  assert.equal(payload.schema, 'iom-independent-eval-audit/v1');
  assert.equal(payload.exportedAt, '2026-11-20T18:30:00.000Z');
  assert.deepEqual(payload.liveReport, liveReport);
  assert.deepEqual(payload.editedAnnotations, editedAnnotations);
});

test('serializeEvalAuditPayload produces valid formatted JSON round-tripping both objects', () => {
  const liveReport = { fleiss_kappa: 0.7143, unanimous_count: 10 };
  const editedAnnotations = {
    items: [{ id: 'P02', annotations: { A1: 'none', A2: null, A3: 'unsure' } }],
  };

  const json = serializeEvalAuditPayload(
    liveReport,
    editedAnnotations,
    '2026-11-20T18:31:00.000Z'
  );
  const parsed = JSON.parse(json);

  assert.deepEqual(parsed.liveReport, liveReport);
  assert.deepEqual(parsed.editedAnnotations, editedAnnotations);
  assert.equal(parsed.exportedAt, '2026-11-20T18:31:00.000Z');
});

test('buildEvalAuditFilename builds deterministic UTC .json filename', () => {
  const date = new Date('2026-11-20T09:05:03.000Z');
  assert.equal(
    buildEvalAuditFilename(date),
    'iom-evaluacion-independiente-auditoria-20261120-090503.json'
  );
});
