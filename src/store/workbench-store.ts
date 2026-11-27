import { create } from 'zustand';
import { temporal } from 'zundo';
import { createInitialWorkbenchDocument, renameWorkbenchDocument } from '@/application/workbench';
import type { ClockPort } from '@/core/ports/runtime';
import type { ModelValidationSummary } from '@/core/schema/common/diagnostics';
import type { DiagramId } from '@/core/schema/common/ids';
import type { WorkbenchDocumentEnvelope } from '@/core/schema/process/notation';
import { summarizeModelValidation } from '@/core/validators/status';

export interface WorkbenchDocumentSlice {
  readonly document: WorkbenchDocumentEnvelope;
}

export interface WorkbenchUiSlice {
  readonly activeDiagramId: DiagramId;
  readonly explorerOpen: boolean;
  readonly inspectorOpen: boolean;
  readonly statusDrawerOpen: boolean;
  readonly frameVisible: boolean;
  readonly validation: ModelValidationSummary;
}

export interface WorkbenchActions {
  setActiveDiagram: (diagramId: DiagramId) => void;
  toggleExplorer: () => void;
  toggleInspector: () => void;
  toggleStatusDrawer: () => void;
  toggleFrameVisible: () => void;
  applyDocument: (nextDocument: WorkbenchDocumentEnvelope) => void;
  renameProject: (nextTitle: string, clock: ClockPort) => void;
  markValidationCompleted: (revision: number) => void;
  markValidationFailed: () => void;
}

export type WorkbenchStoreState = WorkbenchDocumentSlice & WorkbenchUiSlice & WorkbenchActions;

export interface StaticBootstrapInput {
  readonly title: string;
  readonly contextActivityTitle: string;
  readonly author: string;
}

export function createStaticShellWorkbenchStore(input: StaticBootstrapInput) {
  const initialDocument = createInitialWorkbenchDocument(
    {
      clock: { nowIso: () => '2026-11-27T00:00:00.000Z' },
      ids: {
        nextId: (prefix) => {
          switch (prefix) {
            case 'prj':
              return 'prj_bootstrap_shell';
            case 'mdl':
              return 'mdl_bootstrap_process';
            case 'dgm':
              return 'dgm_a_minus_0';
            case 'nod':
              return 'nod_a0';
            default:
              return `${prefix}_bootstrap`;
          }
        },
      },
    },
    input,
  );

  return createWorkbenchStore(initialDocument);
}

export function createWorkbenchStore(initialDocument: WorkbenchDocumentEnvelope) {
  return create<WorkbenchStoreState>()(
    temporal(
      (set, get) => ({
        document: initialDocument,
        activeDiagramId: initialDocument.rootDiagramId,
        explorerOpen: true,
        inspectorOpen: true,
        statusDrawerOpen: false,
        frameVisible: true,
        validation: summarizeModelValidation([], initialDocument.revision, initialDocument.revision, false),
        setActiveDiagram: (diagramId) => set({ activeDiagramId: diagramId }),
        toggleExplorer: () => set((state) => ({ explorerOpen: !state.explorerOpen })),
        toggleInspector: () => set((state) => ({ inspectorOpen: !state.inspectorOpen })),
        toggleStatusDrawer: () => set((state) => ({ statusDrawerOpen: !state.statusDrawerOpen })),
        toggleFrameVisible: () => set((state) => ({ frameVisible: !state.frameVisible })),
        applyDocument: (nextDocument) =>
          set((state) => ({
            document: nextDocument,
            validation: summarizeModelValidation(
              state.validation.diagnostics,
              state.validation.checkedRevision,
              nextDocument.revision,
              false,
            ),
          })),
        renameProject: (nextTitle, clock) => {
          const current = get().document;
          const nextDoc = renameWorkbenchDocument(current, nextTitle, clock);
          if (nextDoc !== current) {
            set({
              document: nextDoc,
              validation: summarizeModelValidation([], nextDoc.revision, nextDoc.revision, false),
            });
          }
        },
        markValidationCompleted: (revision) =>
          set((state) => ({
            validation: summarizeModelValidation([], revision, state.document.revision, false),
          })),
        markValidationFailed: () =>
          set((state) => ({
            validation: summarizeModelValidation(
              state.validation.diagnostics,
              state.validation.checkedRevision,
              state.document.revision,
              true,
            ),
          })),
      }),
      {
        limit: 100,
        partialize: (state): WorkbenchDocumentSlice => ({
          document: state.document,
        }),
        equality: (pastState, currentState) => pastState.document === currentState.document,
      },
    ),
  );
}

export type WorkbenchStore = ReturnType<typeof createWorkbenchStore>;
