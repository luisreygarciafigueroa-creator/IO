export type JsonTokenKind =
  | 'key'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'punctuation'
  | 'whitespace';

export interface JsonToken {
  kind: JsonTokenKind;
  value: string;
}

export interface JsonTokenizedLine {
  lineNumber: number;
  tokens: JsonToken[];
}

const JSON_TOKEN_REGEX =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}\[\],:]|\s+)/g;

/**
 * Formats any JSON-serializable payload with 2-space indentation and splits it
 * into syntax-tokenized lines whose concatenated token values reconstruct the
 * formatted string verbatim.
 */
export function tokenizeJsonLines(data: unknown): {
  formatted: string;
  lines: JsonTokenizedLine[];
} {
  const formatted = JSON.stringify(data, null, 2) ?? 'null';
  const rawLines = formatted.split('\n');

  const lines: JsonTokenizedLine[] = rawLines.map((line, index) => {
    const tokens: JsonToken[] = [];
    let lastIndex = 0;
    JSON_TOKEN_REGEX.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = JSON_TOKEN_REGEX.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          kind: 'whitespace',
          value: line.slice(lastIndex, match.index),
        });
      }

      const tokenText = match[0];
      lastIndex = match.index + tokenText.length;

      if (/^\s+$/.test(tokenText)) {
        tokens.push({ kind: 'whitespace', value: tokenText });
      } else if (tokenText.startsWith('"')) {
        if (tokenText.endsWith(':')) {
          const colonIdx = tokenText.lastIndexOf(':');
          const keyPart = tokenText.slice(0, colonIdx);
          const betweenAndColon = tokenText.slice(colonIdx);
          tokens.push({ kind: 'key', value: keyPart });
          tokens.push({ kind: 'punctuation', value: betweenAndColon });
        } else if (/\s+:$/.test(tokenText)) {
          // Handled above since endsWith(':') is true; kept for clarity
          tokens.push({ kind: 'key', value: tokenText });
        } else {
          tokens.push({ kind: 'string', value: tokenText });
        }
      } else if (tokenText === 'true' || tokenText === 'false') {
        tokens.push({ kind: 'boolean', value: tokenText });
      } else if (tokenText === 'null') {
        tokens.push({ kind: 'null', value: tokenText });
      } else if (/^[{}\[\],:]$/.test(tokenText)) {
        tokens.push({ kind: 'punctuation', value: tokenText });
      } else {
        tokens.push({ kind: 'number', value: tokenText });
      }
    }

    if (lastIndex < line.length) {
      tokens.push({
        kind: 'whitespace',
        value: line.slice(lastIndex),
      });
    }

    return {
      lineNumber: index + 1,
      tokens,
    };
  });

  return { formatted, lines };
}

export interface SpecMetadataSummary {
  topLevelKeys: string[];
  schemaVersion: string;
  specVersion: string;
  sourceDate: string;
  idempotent: boolean;
  shortHash: string;
}

export function extractSpecMetadataSummary(specData: {
  spec?: {
    schema_version?: string;
    spec_version?: string;
    source_date?: string;
  };
  fixedPoint?: {
    pass1Hash?: string;
    idempotent?: boolean;
  };
  [key: string]: unknown;
}): SpecMetadataSummary {
  const pass1Hash = specData.fixedPoint?.pass1Hash ?? '';
  return {
    topLevelKeys: Object.keys(specData),
    schemaVersion: specData.spec?.schema_version ?? '—',
    specVersion: specData.spec?.spec_version ?? '—',
    sourceDate: specData.spec?.source_date ?? '—',
    idempotent: Boolean(specData.fixedPoint?.idempotent),
    shortHash: pass1Hash ? pass1Hash.slice(0, 12) : '—',
  };
}
