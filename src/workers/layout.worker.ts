import type { AsyncJobHeader } from '@/core/ports/runtime';
import type { DiagramId } from '@/core/schema/common/ids';

export interface LayoutWorkerRequest {
  readonly type: 'run_layout';
  readonly job: AsyncJobHeader;
  readonly diagramId: DiagramId;
}

export interface LayoutWorkerResponse {
  readonly type: 'layout_completed' | 'layout_failed';
  readonly job: AsyncJobHeader;
  readonly diagramId: DiagramId;
}

export function createStaleCheckGuard(
  activeRevision: number,
  response: LayoutWorkerResponse,
): boolean {
  return response.job.inputRevision === activeRevision;
}
