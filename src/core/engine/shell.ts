import {
  diagramIdSchema,
  modelIdSchema,
  nodeIdSchema,
  projectIdSchema,
} from '../schema/common/ids';
import type { WorkbenchDocumentEnvelope } from '../schema/process/notation';
import { CURRENT_SCHEMA_VERSION, SUPPORTED_FORMAT_ID } from '../schema/migrations';

export interface InitialProjectSeed {
  readonly projectIdRaw: string;
  readonly modelIdRaw: string;
  readonly rootDiagramIdRaw: string;
  readonly contextActivityIdRaw: string;
  readonly updatedAtIso: string;
  readonly title: string;
  readonly contextActivityTitle: string;
  readonly author: string;
}

/**
 * Builds the initial deterministic IDEF0 context document descriptor for the workbench shell.
 */
export function createBootstrapDocument(seed: InitialProjectSeed): WorkbenchDocumentEnvelope {
  const projectId = projectIdSchema.parse(seed.projectIdRaw);
  const modelId = modelIdSchema.parse(seed.modelIdRaw);
  const rootDiagramId = diagramIdSchema.parse(seed.rootDiagramIdRaw);
  const contextActivityId = nodeIdSchema.parse(seed.contextActivityIdRaw);

  return {
    formatId: SUPPORTED_FORMAT_ID,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    projectId,
    modelId,
    revision: 1,
    title: seed.title,
    author: seed.author,
    lifecycleStatus: 'working',
    updatedAtIso: seed.updatedAtIso,
    rootDiagramId,
    contextActivityId,
    diagrams: [
      {
        id: rootDiagramId,
        code: 'A-0',
        title: seed.contextActivityTitle,
        notation: 'idef0',
        parentDiagramId: null,
        isContext: true,
        nodeCount: 1,
      },
    ],
  };
}

/**
 * Applies a deterministic title update on a document copy and increments revision.
 */
export function renameBootstrapDocument(
  document: WorkbenchDocumentEnvelope,
  nextTitle: string,
  updatedAtIso: string,
): WorkbenchDocumentEnvelope {
  const trimmed = nextTitle.trim();
  if (!trimmed || trimmed === document.title) {
    return document;
  }

  return {
    ...document,
    title: trimmed,
    revision: document.revision + 1,
    updatedAtIso,
  };
}
