import test from 'node:test';
import assert from 'node:assert/strict';
import { extractSpecMetadataSummary, tokenizeJsonLines } from './specJsonSyntax';

test('tokenizeJsonLines classifies JSON keys, strings, numbers, booleans, null and punctuation accurately', () => {
  const sample = {
    spec_version: '1.10.0',
    quoted: 'valor con "comillas": y dos puntos',
    counts: {
      nodes: 78,
      ratio: -0.6871,
    },
    idempotent: true,
    corrupted: false,
    optional: null,
    tags: ['a', 'b'],
  };

  const { formatted, lines } = tokenizeJsonLines(sample);

  // Concatenated tokens must reproduce formatted JSON identically
  const reconstructed = lines.map((l) => l.tokens.map((t) => t.value).join('')).join('\n');
  assert.equal(reconstructed, formatted);
  assert.equal(lines[0].lineNumber, 1);
  assert.equal(lines[lines.length - 1].lineNumber, lines.length);

  const flatTokens = lines.flatMap((l) => l.tokens);

  assert.ok(flatTokens.some((t) => t.kind === 'key' && t.value === '"spec_version"'));
  assert.ok(
    flatTokens.some(
      (t) => t.kind === 'string' && t.value === '"valor con \\"comillas\\": y dos puntos"'
    )
  );
  assert.ok(flatTokens.some((t) => t.kind === 'number' && t.value === '78'));
  assert.ok(flatTokens.some((t) => t.kind === 'number' && t.value === '-0.6871'));
  assert.ok(flatTokens.some((t) => t.kind === 'boolean' && t.value === 'true'));
  assert.ok(flatTokens.some((t) => t.kind === 'boolean' && t.value === 'false'));
  assert.ok(flatTokens.some((t) => t.kind === 'null' && t.value === 'null'));
  assert.ok(flatTokens.some((t) => t.kind === 'punctuation' && t.value === '{'));
  assert.ok(flatTokens.some((t) => t.kind === 'punctuation' && t.value === ':'));
});

test('extractSpecMetadataSummary summarizes specData keys, versions and fixed-point hash', () => {
  const summary = extractSpecMetadataSummary({
    spec: {
      schema_version: '1.0.0',
      spec_version: '1.10.0',
      source_date: '2026-03-07',
    },
    counts: { nodes: 78 },
    fixedPoint: {
      pass1Hash: 'abcdef1234567890fedcba',
      idempotent: true,
    },
    expandedCategories: [],
  });

  assert.deepEqual(summary.topLevelKeys, [
    'spec',
    'counts',
    'fixedPoint',
    'expandedCategories',
  ]);
  assert.equal(summary.schemaVersion, '1.0.0');
  assert.equal(summary.specVersion, '1.10.0');
  assert.equal(summary.sourceDate, '2026-03-07');
  assert.equal(summary.idempotent, true);
  assert.equal(summary.shortHash, 'abcdef123456');
});
