import type { DiagramId } from '../schema/common/ids';
import type { Point, Rect } from '../layout/bounds';

export interface SceneNodeRect {
  readonly id: string;
  readonly bounds: Rect;
  readonly label: string;
  readonly code: string;
}

export interface ScenePath {
  readonly id: string;
  readonly points: readonly Point[];
  readonly label: string;
}

export interface DrawingScene {
  readonly diagramId: DiagramId;
  readonly revision: number;
  readonly bounds: Rect;
  readonly nodes: readonly SceneNodeRect[];
  readonly paths: readonly ScenePath[];
}

/**
 * Creates an empty deterministic drawing scene container for a diagram revision.
 */
export function createEmptyDrawingScene(diagramId: DiagramId, revision: number): DrawingScene {
  return {
    diagramId,
    revision,
    bounds: { x: 0, y: 0, width: 1120, height: 790 },
    nodes: [],
    paths: [],
  };
}
