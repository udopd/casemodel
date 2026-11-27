import { z } from 'zod';
import { diagramIdSchema, modelIdSchema, nodeIdSchema, projectIdSchema } from '../common/ids';

export const notationKindSchema = z.enum(['idef0', 'dfd', 'idef3']);
export type NotationKind = z.infer<typeof notationKindSchema>;

export const icomRoleSchema = z.enum(['input', 'control', 'output', 'mechanism']);
export type IcomRole = z.infer<typeof icomRoleSchema>;

export const lifecycleStatusSchema = z.enum(['working', 'draft', 'recommended', 'publication']);
export type LifecycleStatus = z.infer<typeof lifecycleStatusSchema>;

export const diagramSummarySchema = z.object({
  id: diagramIdSchema,
  code: z.string().min(1),
  title: z.string().min(1),
  notation: notationKindSchema,
  parentDiagramId: diagramIdSchema.nullable(),
  isContext: z.boolean(),
  nodeCount: z.number().int().nonnegative(),
});
export type DiagramSummary = z.infer<typeof diagramSummarySchema>;

export const workbenchDocumentEnvelopeSchema = z.object({
  formatId: z.literal('casemodel.bpw'),
  schemaVersion: z.literal(1),
  projectId: projectIdSchema,
  modelId: modelIdSchema,
  revision: z.number().int().nonnegative(),
  title: z.string().min(1),
  author: z.string(),
  lifecycleStatus: lifecycleStatusSchema,
  updatedAtIso: z.string().min(1),
  rootDiagramId: diagramIdSchema,
  contextActivityId: nodeIdSchema,
  diagrams: z.array(diagramSummarySchema).min(1),
});
export type WorkbenchDocumentEnvelope = z.infer<typeof workbenchDocumentEnvelopeSchema>;
