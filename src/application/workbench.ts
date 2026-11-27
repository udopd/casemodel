import { createBootstrapDocument, renameBootstrapDocument } from '@/core/engine/shell';
import type { ClockPort, IdGeneratorPort } from '@/core/ports/runtime';
import type { ModelValidationSummary } from '@/core/schema/common/diagnostics';
import type { WorkbenchDocumentEnvelope } from '@/core/schema/process/notation';
import { summarizeModelValidation } from '@/core/validators/status';

export interface CreateWorkbenchDocumentInput {
  readonly title: string;
  readonly contextActivityTitle: string;
  readonly author: string;
}

export interface WorkbenchApplicationPorts {
  readonly clock: ClockPort;
  readonly ids: IdGeneratorPort;
}

/**
 * Creates a fresh local-first process modeling document rooted at IDEF0 A-0.
 */
export function createInitialWorkbenchDocument(
  ports: WorkbenchApplicationPorts,
  input: CreateWorkbenchDocumentInput,
): WorkbenchDocumentEnvelope {
  return createBootstrapDocument({
    projectIdRaw: ports.ids.nextId('prj'),
    modelIdRaw: ports.ids.nextId('mdl'),
    rootDiagramIdRaw: ports.ids.nextId('dgm'),
    contextActivityIdRaw: ports.ids.nextId('nod'),
    updatedAtIso: ports.clock.nowIso(),
    title: input.title,
    contextActivityTitle: input.contextActivityTitle,
    author: input.author,
  });
}

/**
 * Renames the active project document via the pure domain engine.
 */
export function renameWorkbenchDocument(
  document: WorkbenchDocumentEnvelope,
  nextTitle: string,
  clock: ClockPort,
): WorkbenchDocumentEnvelope {
  return renameBootstrapDocument(document, nextTitle, clock.nowIso());
}

/**
 * Evaluates model-wide validation status for the active document revision.
 */
export function evaluateWorkbenchValidation(
  document: WorkbenchDocumentEnvelope,
  checkedRevision: number | null,
  validationFailed = false,
): ModelValidationSummary {
  return summarizeValidationResult(document, checkedRevision, validationFailed);
}

function summarizeValidationResult(
  document: WorkbenchDocumentEnvelope,
  checkedRevision: number | null,
  validationFailed: boolean,
): ModelValidationSummary {
  return summarizeModelValidation([], checkedRevision, document.revision, validationFailed);
}
