import type { DiagramId, ModelId, ProjectId } from '../schema/common/ids';
import type { WorkbenchDocumentEnvelope } from '../schema/process/notation';

export interface ClockPort {
  nowIso(): string;
}

export interface IdGeneratorPort {
  nextId(prefix: string): string;
}

export interface TextMeasurement {
  readonly width: number;
  readonly height: number;
}

export interface TextMeasurementPort {
  measureText(text: string, fontFamily: string, fontSizePx: number, maxWidthPx?: number): TextMeasurement;
}

export interface AsyncJobHeader {
  readonly projectId: ProjectId;
  readonly modelId: ModelId;
  readonly inputRevision: number;
  readonly jobId: string;
}

export interface LayoutPort {
  readonly strategyId: string;
  runLayout(job: AsyncJobHeader, diagramId: DiagramId): Promise<void>;
}

export interface ProjectMetadataRecord {
  readonly projectId: ProjectId;
  readonly title: string;
  readonly revision: number;
  readonly updatedAtIso: string;
}

export interface ProjectRepositoryPort {
  listMetadata(): Promise<readonly ProjectMetadataRecord[]>;
  load(projectId: ProjectId): Promise<WorkbenchDocumentEnvelope | null>;
  save(document: WorkbenchDocumentEnvelope, expectedRevision: number): Promise<void>;
  remove(projectId: ProjectId): Promise<void>;
}
