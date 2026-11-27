import type { DiagnosticEntry, ModelValidationSummary } from '../schema/common/diagnostics';

/**
 * Computes the model-wide validation status strictly from checked revision and diagnostics.
 * Green status ('valid') is emitted only when the current revision has been checked cleanly.
 */
export function summarizeModelValidation(
  diagnostics: readonly DiagnosticEntry[],
  checkedRevision: number | null,
  currentRevision: number,
  validationFailed: boolean,
): ModelValidationSummary {
  const errorCount = diagnostics.filter((item) => item.severity === 'error').length;
  const warningCount = diagnostics.filter((item) => item.severity === 'warning').length;

  if (validationFailed) {
    return {
      state: 'failed',
      errorCount,
      warningCount,
      checkedRevision,
      currentRevision,
      diagnostics,
    };
  }

  if (checkedRevision === null || checkedRevision !== currentRevision) {
    return {
      state: 'checking',
      errorCount,
      warningCount,
      checkedRevision,
      currentRevision,
      diagnostics,
    };
  }

  if (errorCount > 0) {
    return {
      state: 'errors',
      errorCount,
      warningCount,
      checkedRevision,
      currentRevision,
      diagnostics,
    };
  }

  if (warningCount > 0) {
    return {
      state: 'warnings',
      errorCount,
      warningCount,
      checkedRevision,
      currentRevision,
      diagnostics,
    };
  }

  return {
    state: 'valid',
    errorCount: 0,
    warningCount: 0,
    checkedRevision,
    currentRevision,
    diagnostics,
  };
}
