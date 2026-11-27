export const SUPPORTED_FORMAT_ID = 'casemodel.bpw' as const;
export const CURRENT_SCHEMA_VERSION = 1 as const;

export type SchemaVersionCheckResult =
  | { readonly ok: true; readonly schemaVersion: typeof CURRENT_SCHEMA_VERSION }
  | { readonly ok: false; readonly reason: 'unsupported_format' | 'unsupported_future_version' | 'invalid_version' };

/**
 * Checks whether a parsed envelope header matches the supported schema version.
 */
export function checkSchemaHeader(formatId: unknown, schemaVersion: unknown): SchemaVersionCheckResult {
  if (formatId !== SUPPORTED_FORMAT_ID) {
    return { ok: false, reason: 'unsupported_format' };
  }
  if (typeof schemaVersion !== 'number' || !Number.isInteger(schemaVersion) || schemaVersion < 1) {
    return { ok: false, reason: 'invalid_version' };
  }
  if (schemaVersion > CURRENT_SCHEMA_VERSION) {
    return { ok: false, reason: 'unsupported_future_version' };
  }
  return { ok: true, schemaVersion: CURRENT_SCHEMA_VERSION };
}
