import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, Code2, Copy, PanelRightClose, PanelRightOpen, Search } from 'lucide-react';
import {
  extractSpecMetadataSummary,
  tokenizeJsonLines,
  type JsonTokenKind,
} from './specJsonSyntax';

type JsonSectionFilter = 'all' | 'spec' | 'counts' | 'fixedPoint' | 'vectorSteps' | 'expandedCategories';

const TOKEN_COLOR_CLASSES: Record<JsonTokenKind, string> = {
  key: 'text-sky-300',
  string: 'text-emerald-300',
  number: 'text-amber-300',
  boolean: 'text-violet-300',
  null: 'text-rose-300',
  punctuation: 'text-slate-500',
  whitespace: '',
};

interface SpecMetadataSidePanelProps {
  specData: {
    spec: {
      schema_version: string;
      spec_version: string;
      title: string;
      source_date: string;
      source_note: string;
      [key: string]: unknown;
    };
    counts: Record<string, unknown>;
    fixedPoint: {
      pass1Hash: string;
      pass2Hash: string;
      idempotent: boolean;
      specVersion: string;
    };
    vectorSteps?: unknown[];
    expandedCategories: unknown[];
    [key: string]: unknown;
  };
}

export function SpecMetadataSidePanel({ specData }: SpecMetadataSidePanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [sectionFilter, setSectionFilter] = useState<JsonSectionFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => extractSpecMetadataSummary(specData), [specData]);

  const scopedPayload = useMemo(() => {
    if (sectionFilter === 'all') return specData;
    return { [sectionFilter]: specData[sectionFilter] ?? null };
  }, [specData, sectionFilter]);

  const { formatted, lines } = useMemo(() => tokenizeJsonLines(scopedPayload), [scopedPayload]);

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const visibleLines = useMemo(() => {
    if (!normalizedQuery) return lines;
    return lines.filter((line) =>
      line.tokens
        .map((t) => t.value)
        .join('')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [lines, normalizedQuery]);

  const availableScopes: Array<{ id: JsonSectionFilter; label: string }> = useMemo(() => {
    const base: Array<{ id: JsonSectionFilter; label: string }> = [
      { id: 'all', label: 'specData completo' },
      { id: 'spec', label: 'spec' },
      { id: 'counts', label: 'counts' },
      { id: 'fixedPoint', label: 'fixedPoint' },
    ];
    if (Array.isArray(specData.vectorSteps)) {
      base.push({ id: 'vectorSteps', label: 'vectorSteps' });
    }
    base.push({ id: 'expandedCategories', label: 'expandedCategories' });
    return base;
  }, [specData.vectorSteps]);

  async function handleCopyJson() {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored cleanly when clipboard permissions are unavailable in headless env
    }
  }

  if (!isOpen) {
    return (
      <aside
        aria-label="Panel lateral de auditoría JSON specData (colapsado)"
        className="lg:w-14 shrink-0"
      >
        <div className="lg:sticky lg:top-6 bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex lg:flex-col items-center justify-between lg:justify-start gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={false}
            aria-controls="specdata-audit-drawer"
            aria-label="Expandir panel de auditoría JSON specData"
            className="w-full lg:w-10 lg:h-10 px-3 py-2 lg:p-0 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <PanelRightOpen className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium lg:hidden">Mostrar JSON specData</span>
          </button>
          <div className="hidden lg:flex flex-col items-center gap-2 py-2 text-[10px] font-mono text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="[writing-mode:vertical-rl] rotate-180 tracking-wider text-slate-400">
              JSON · specData
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 lg:hidden">
            v{summary.specVersion} · {lines.length} líneas
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      id="specdata-audit-drawer"
      aria-label="Panel lateral de auditoría JSON specData"
      className="w-full lg:w-[420px] xl:w-[460px] shrink-0"
    >
      <div className="lg:sticky lg:top-6 bg-slate-900/85 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-slate-950/50">
        <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400 shrink-0" />
              <h2 className="text-sm font-semibold text-white truncate">
                Auditoría JSON · specData
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Metadatos completos de <code className="text-sky-300">/api/spec</code> ({lines.length} líneas)
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyJson}
              aria-label="Copiar JSON de specData"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-expanded={true}
              aria-controls="specdata-audit-drawer"
              aria-label="Colapsar panel de auditoría JSON specData"
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition cursor-pointer"
            >
              <PanelRightClose className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Colapsar</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/50 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <div className="text-slate-500">spec / schema</div>
              <div className="text-sky-300 mt-0.5">
                v{summary.specVersion} · {summary.schemaVersion}
              </div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <div className="text-slate-500">pass1Hash</div>
              <div className="text-emerald-300 mt-0.5 truncate" title={specData.fixedPoint.pass1Hash}>
                {summary.shortHash}… ({summary.idempotent ? 'Sₙ₊₁=Sₙ' : 'ERR'})
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {availableScopes.map((scope) => {
              const active = sectionFilter === scope.id;
              return (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setSectionFilter(scope.id)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                    active
                      ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {active && <ChevronRight className="w-3 h-3 text-sky-400" />}
                  {scope.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar líneas por clave o valor…"
              aria-label="Filtrar líneas JSON de specData"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/50 focus:outline-none rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div
          data-testid="specdata-json-viewer"
          className="bg-slate-950/90 max-h-[68vh] overflow-auto px-3 py-3 text-[11px] leading-5 font-mono"
        >
          {visibleLines.length === 0 ? (
            <div className="py-6 text-center text-slate-500">
              Sin coincidencias para «{searchTerm}».
            </div>
          ) : (
            <pre className="m-0">
              <code>
                {visibleLines.map((line) => (
                  <div
                    key={line.lineNumber}
                    className="flex items-start hover:bg-slate-900/60 rounded px-1 -mx-1"
                  >
                    <span
                      aria-hidden="true"
                      className="w-9 shrink-0 select-none text-right pr-3 text-slate-600"
                    >
                      {line.lineNumber}
                    </span>
                    <span className="whitespace-pre text-slate-300">
                      {line.tokens.map((token, idx) =>
                        token.kind === 'whitespace' ? (
                          <React.Fragment key={idx}>{token.value}</React.Fragment>
                        ) : (
                          <span key={idx} className={TOKEN_COLOR_CLASSES[token.kind]}>
                            {token.value}
                          </span>
                        )
                      )}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>
            claves raíz: {summary.topLevelKeys.join(', ')}
          </span>
          <span>
            {visibleLines.length}/{lines.length} líneas
          </span>
        </div>
      </div>
    </aside>
  );
}
