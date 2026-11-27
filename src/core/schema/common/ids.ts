import { z } from 'zod';

export const nonEmptyIdSchema = z.string().min(1).max(128);

export const projectIdSchema = nonEmptyIdSchema.brand<'ProjectId'>();
export const modelIdSchema = nonEmptyIdSchema.brand<'ModelId'>();
export const diagramIdSchema = nonEmptyIdSchema.brand<'DiagramId'>();
export const nodeIdSchema = nonEmptyIdSchema.brand<'NodeId'>();
export const relationIdSchema = nonEmptyIdSchema.brand<'RelationId'>();

export type ProjectId = z.infer<typeof projectIdSchema>;
export type ModelId = z.infer<typeof modelIdSchema>;
export type DiagramId = z.infer<typeof diagramIdSchema>;
export type NodeId = z.infer<typeof nodeIdSchema>;
export type RelationId = z.infer<typeof relationIdSchema>;
