export interface EvalAuditExportPayload<TReport, TAnnotations> {
  schema: string;
  exportedAt: string;
  liveReport: TReport;
  editedAnnotations: TAnnotations;
}

export function buildEvalAuditPayload<TReport, TAnnotations>(
  liveReport: TReport,
  editedAnnotations: TAnnotations,
  exportedAt: string = new Date().toISOString()
): EvalAuditExportPayload<TReport, TAnnotations> {
  return {
    schema: 'iom-independent-eval-audit/v1',
    exportedAt,
    liveReport,
    editedAnnotations,
  };
}

export function serializeEvalAuditPayload<TReport, TAnnotations>(
  liveReport: TReport,
  editedAnnotations: TAnnotations,
  exportedAt?: string
): string {
  return JSON.stringify(
    buildEvalAuditPayload(liveReport, editedAnnotations, exportedAt),
    null,
    2
  );
}

export function buildEvalAuditFilename(exportedAt: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const datePart = `${exportedAt.getUTCFullYear()}${pad(exportedAt.getUTCMonth() + 1)}${pad(
    exportedAt.getUTCDate()
  )}`;
  const timePart = `${pad(exportedAt.getUTCHours())}${pad(exportedAt.getUTCMinutes())}${pad(
    exportedAt.getUTCSeconds()
  )}`;
  return `iom-evaluacion-independiente-auditoria-${datePart}-${timePart}.json`;
}
