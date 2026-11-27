import { z } from 'zod';
import { diagramIdSchema, nodeIdSchema, relationIdSchema } from './ids';

export const diagnosticSeveritySchema = z.enum(['error', 'warning']);
export type DiagnosticSeverity = z.infer<typeof diagnosticSeveritySchema>;

export const diagnosticScopeSchema = z.enum(['model', 'diagram', 'node', 'relation', 'boundary']);
export type DiagnosticScope = z.infer<typeof diagnosticScopeSchema>;

export const diagnosticMessageKeySchema = z.enum([
  'model.idef0.root-required',
  'diagram.idef0.block-count-range',
  'relation.idef0.invalid-icom-side',
  'relation.dfd.direct-store-to-store',
  'junction.idef3.incomplete-branch',
]);
export type DiagnosticMessageKey = z.infer<typeof diagnosticMessageKeySchema>;

export const diagnosticEntrySchema = z.object({
  id: z.string().min(1),
  ruleId: z.string().min(1),
  severity: diagnosticSeveritySchema,
  scope: diagnosticScopeSchema,
  diagramId: diagramIdSchema,
  nodeId: nodeIdSchema.optional(),
  relationId: relationIdSchema.optional(),
  revision: z.number().int().nonnegative(),
  messageKey: diagnosticMessageKeySchema,
  params: z.record(z.string(), z.union([z.string(), z.number()])),
});
export type DiagnosticEntry = z.infer<typeof diagnosticEntrySchema>;

export const modelValidationStateSchema = z.enum([
  'checking',
  'valid',
  'warnings',
  'errors',
  'failed',
]);
export type ModelValidationState = z.infer<typeof modelValidationStateSchema>;

export interface ModelValidationSummary {
  readonly state: ModelValidationState;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly checkedRevision: number | null;
  readonly currentRevision: number;
  readonly diagnostics: readonly DiagnosticEntry[];
}
