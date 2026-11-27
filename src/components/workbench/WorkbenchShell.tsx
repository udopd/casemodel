'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Frame,
  GitBranchPlus,
  LayoutGrid,
  Loader2,
  PanelLeft,
  PanelRight,
  PlusSquare,
  Redo2,
  ShieldCheck,
  Undo2,
  XCircle,
} from 'lucide-react';
import { useStore } from 'zustand';
import type { ClockPort } from '@/core/ports/runtime';
import type { ModelValidationState } from '@/core/schema/common/diagnostics';
import {
  LIFECYCLE_LABELS_RU,
  NOTATION_LABELS_RU,
  WORKBENCH_COPY_RU,
  formatValidationStatusRu,
} from '@/i18n/ru';
import { createStaticShellWorkbenchStore, type WorkbenchStore } from '@/store/workbench-store';

export interface WorkbenchShellProps {
  readonly clock: ClockPort;
}

function createInitialStaticShellStore(): WorkbenchStore {
  return createStaticShellWorkbenchStore({
    title: WORKBENCH_COPY_RU.defaultProjectTitle,
    contextActivityTitle: WORKBENCH_COPY_RU.defaultContextActivityTitle,
    author: WORKBENCH_COPY_RU.defaultAuthor,
  });
}

function renderValidationIcon(state: ModelValidationState) {
  switch (state) {
    case 'checking':
      return <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" aria-hidden="true" />;
    case 'valid':
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />;
    case 'warnings':
      return <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />;
    case 'errors':
      return <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-700" aria-hidden="true" />;
  }
}

export function WorkbenchShell({ clock }: WorkbenchShellProps) {
  const [store] = useState<WorkbenchStore>(() => createInitialStaticShellStore());

  const document = useStore(store, (s) => s.document);
  const activeDiagramId = useStore(store, (s) => s.activeDiagramId);
  const explorerOpen = useStore(store, (s) => s.explorerOpen);
  const inspectorOpen = useStore(store, (s) => s.inspectorOpen);
  const statusDrawerOpen = useStore(store, (s) => s.statusDrawerOpen);
  const frameVisible = useStore(store, (s) => s.frameVisible);
  const validation = useStore(store, (s) => s.validation);

  const setActiveDiagram = useStore(store, (s) => s.setActiveDiagram);
  const toggleExplorer = useStore(store, (s) => s.toggleExplorer);
  const toggleInspector = useStore(store, (s) => s.toggleInspector);
  const toggleStatusDrawer = useStore(store, (s) => s.toggleStatusDrawer);
  const toggleFrameVisible = useStore(store, (s) => s.toggleFrameVisible);
  const renameProject = useStore(store, (s) => s.renameProject);
  const markValidationCompleted = useStore(store, (s) => s.markValidationCompleted);

  const canUndo = useStore(store.temporal, (t) => t.pastStates.length > 0);
  const canRedo = useStore(store.temporal, (t) => t.futureStates.length > 0);
  const undo = useStore(store.temporal, (t) => t.undo);
  const redo = useStore(store.temporal, (t) => t.redo);

  const [titleDraft, setTitleDraft] = useState(document.title);
  const [prevDocTitle, setPrevDocTitle] = useState(document.title);
  if (prevDocTitle !== document.title) {
    setPrevDocTitle(document.title);
    setTitleDraft(document.title);
  }

  const activeDiagram =
    document.diagrams.find((item) => item.id === activeDiagramId) ?? document.diagrams[0];

  const handleTitleCommit = () => {
    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === document.title) {
      setTitleDraft(document.title);
      return;
    }
    renameProject(trimmed, clock);
  };

  const handleTitleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleTitleCommit();
  };

  const validationLabel = formatValidationStatusRu(
    validation.state,
    validation.errorCount,
    validation.warningCount,
  );

  return (
    <div
      data-testid="workbench-root"
      className="flex h-dvh flex-col overflow-hidden bg-[#F8FAFC] text-[13px] text-slate-900"
    >
      {/* 48 px Top Toolbar */}
      <header
        data-testid="workbench-toolbar"
        className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-[#E2E8F0] bg-[#FFFFFF] px-3"
      >
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            aria-label={WORKBENCH_COPY_RU.toolbar.openHome}
            className="rounded px-2 py-1 font-semibold tracking-tight text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            {WORKBENCH_COPY_RU.appName}
          </Link>
          <span className="h-4 w-px bg-[#E2E8F0]" aria-hidden="true" />
          <button
            type="button"
            data-testid="toggle-explorer-button"
            aria-expanded={explorerOpen}
            aria-label={WORKBENCH_COPY_RU.toolbar.explorerToggle}
            onClick={toggleExplorer}
            className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-[#2563EB] ${
              explorerOpen
                ? 'bg-blue-50 text-[#2563EB]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <PanelLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{WORKBENCH_COPY_RU.toolbar.explorerToggle}</span>
          </button>
          <span className="hidden truncate font-medium text-slate-700 md:inline" data-testid="toolbar-project-title">
            {document.title}
          </span>
        </div>

        <nav aria-label="Инструменты моделирования" className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            data-testid="undo-button"
            aria-label={WORKBENCH_COPY_RU.toolbar.undo}
            disabled={!canUndo}
            onClick={() => undo()}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden xl:inline">{WORKBENCH_COPY_RU.toolbar.undo}</span>
          </button>
          <button
            type="button"
            data-testid="redo-button"
            aria-label={WORKBENCH_COPY_RU.toolbar.redo}
            disabled={!canRedo}
            onClick={() => redo()}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <Redo2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden xl:inline">{WORKBENCH_COPY_RU.toolbar.redo}</span>
          </button>

          <span className="mx-1 h-4 w-px bg-[#E2E8F0]" aria-hidden="true" />

          <button
            type="button"
            disabled
            title="Доступно на этапе 3 (вертикальный срез IDEF0)"
            className="hidden items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-400 md:inline-flex"
          >
            <PlusSquare className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{WORKBENCH_COPY_RU.toolbar.addBlock}</span>
          </button>
          <button
            type="button"
            disabled
            title="Доступно на этапе 3 (декомпозиция)"
            className="hidden items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-400 md:inline-flex"
          >
            <GitBranchPlus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{WORKBENCH_COPY_RU.toolbar.decompose}</span>
          </button>
          <button
            type="button"
            disabled
            title="Доступно на этапе 3 (авторасстановка)"
            className="hidden items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-400 lg:inline-flex"
          >
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{WORKBENCH_COPY_RU.toolbar.autoLayout}</span>
          </button>

          <button
            type="button"
            data-testid="toggle-frame-button"
            aria-pressed={frameVisible}
            onClick={toggleFrameVisible}
            className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-[#2563EB] ${
              frameVisible
                ? 'bg-blue-50 text-[#2563EB]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Frame className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{WORKBENCH_COPY_RU.toolbar.frameToggle}</span>
          </button>

          <button
            type="button"
            data-testid="validate-model-button"
            onClick={() => markValidationCompleted(document.revision)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
            <span className="hidden md:inline">{WORKBENCH_COPY_RU.toolbar.validate}</span>
          </button>

          <button
            type="button"
            disabled
            title="Экспорт PNG / SVG / PDF подключается на этапе 5"
            className="hidden items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-400 sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{WORKBENCH_COPY_RU.toolbar.exportMenu}</span>
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 sm:inline">
            {activeDiagram ? NOTATION_LABELS_RU[activeDiagram.notation] : 'IDEF0'}
          </span>
          <button
            type="button"
            data-testid="toggle-inspector-button"
            aria-expanded={inspectorOpen}
            aria-label={WORKBENCH_COPY_RU.toolbar.inspectorToggle}
            onClick={toggleInspector}
            className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-[#2563EB] ${
              inspectorOpen
                ? 'bg-blue-50 text-[#2563EB]'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <PanelRight className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{WORKBENCH_COPY_RU.toolbar.inspectorToggle}</span>
          </button>
        </div>
      </header>

      {/* Center Workbench Area (Explorer + Canvas + Inspector) */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* 260 px Collapsible Explorer */}
        {explorerOpen && (
          <aside
            data-testid="workbench-explorer"
            aria-label={WORKBENCH_COPY_RU.explorer.title}
            className="fixed top-12 bottom-8 left-0 z-20 flex w-[260px] shrink-0 flex-col border-r border-[#E2E8F0] bg-[#FFFFFF] shadow-lg lg:static lg:inset-auto lg:z-auto lg:shadow-none"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-3 py-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {WORKBENCH_COPY_RU.explorer.title}
              </h2>
              <button
                type="button"
                aria-label={WORKBENCH_COPY_RU.explorer.collapse}
                onClick={toggleExplorer}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
              >
                <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {WORKBENCH_COPY_RU.explorer.diagramsSection}
              </p>
              <ul className="space-y-1">
                {document.diagrams.map((diagram) => {
                  const isActive = diagram.id === activeDiagram?.id;
                  return (
                    <li key={diagram.id}>
                      <button
                        type="button"
                        onClick={() => setActiveDiagram(diagram.id)}
                        className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-[#2563EB] ${
                          isActive
                            ? 'bg-blue-50 text-[#2563EB]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="rounded border border-[#E2E8F0] bg-[#FFFFFF] px-1.5 py-0.5 font-mono text-[11px] font-semibold">
                            {diagram.code}
                          </span>
                          <span className="truncate font-medium">{diagram.title}</span>
                        </span>
                        {diagram.isContext && (
                          <span className="shrink-0 text-[11px] text-slate-500">
                            {WORKBENCH_COPY_RU.explorer.contextBadge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}

        {/* Flexible Center Canvas */}
        <main
          data-testid="workbench-canvas"
          aria-label={WORKBENCH_COPY_RU.canvas.regionLabel}
          className="relative flex min-w-0 flex-1 flex-col items-center justify-center overflow-auto bg-[#F8FAFC] p-6"
        >
          <div
            className={`flex w-full max-w-2xl flex-col items-center justify-between rounded-lg bg-[#FFFFFF] p-6 transition ${
              frameVisible
                ? 'border-2 border-slate-300 shadow-xs'
                : 'border border-dashed border-[#E2E8F0]'
            }`}
          >
            <div className="flex w-full items-center justify-between border-b border-[#E2E8F0] pb-3 text-xs text-slate-500">
              <span className="font-mono">
                {activeDiagram?.code ?? 'A-0'} ·{' '}
                {activeDiagram ? NOTATION_LABELS_RU[activeDiagram.notation] : 'IDEF0'}
              </span>
              <span>
                {frameVisible
                  ? WORKBENCH_COPY_RU.canvas.frameStandardLabel
                  : WORKBENCH_COPY_RU.canvas.frameHiddenLabel}
              </span>
            </div>

            <div className="my-10 flex flex-col items-center gap-4">
              <div
                data-testid="context-activity-preview"
                className="flex min-h-[92px] w-64 flex-col justify-between rounded border-2 border-slate-800 bg-[#FFFFFF] p-3 shadow-xs"
              >
                <span className="text-center text-sm font-medium text-slate-900">
                  {activeDiagram?.title ?? WORKBENCH_COPY_RU.defaultContextActivityTitle}
                </span>
                <span className="self-end font-mono text-xs font-semibold text-slate-600">
                  {WORKBENCH_COPY_RU.canvas.contextActivityPrefix}
                </span>
              </div>
              <div className="max-w-md text-center">
                <p className="font-medium text-slate-800">{WORKBENCH_COPY_RU.canvas.shellNoticeTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {WORKBENCH_COPY_RU.canvas.shellNoticeBody}
                </p>
              </div>
            </div>

            <div className="flex w-full items-center justify-between border-t border-[#E2E8F0] pt-3 text-xs text-slate-500">
              <span>{WORKBENCH_COPY_RU.canvas.localFirstBadge}</span>
              <span className="font-mono">
                {WORKBENCH_COPY_RU.statusBar.revisionPrefix}: {document.revision}
              </span>
            </div>
          </div>
        </main>

        {/* 280 px Collapsible Contextual Inspector */}
        {inspectorOpen && (
          <aside
            data-testid="workbench-inspector"
            aria-label={WORKBENCH_COPY_RU.inspector.title}
            className="fixed top-12 bottom-8 right-0 z-20 flex w-[280px] shrink-0 flex-col border-l border-[#E2E8F0] bg-[#FFFFFF] shadow-lg lg:static lg:inset-auto lg:z-auto lg:shadow-none"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-3 py-2.5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                {WORKBENCH_COPY_RU.inspector.title}
              </h2>
              <button
                type="button"
                aria-label={WORKBENCH_COPY_RU.inspector.collapse}
                onClick={toggleInspector}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
              >
                <PanelRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-3">
              <section aria-labelledby="inspector-project-section" className="space-y-2.5">
                <h3
                  id="inspector-project-section"
                  className="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  {WORKBENCH_COPY_RU.inspector.projectSection}
                </h3>

                <form onSubmit={handleTitleSubmit} className="space-y-1">
                  <label htmlFor="project-title-input" className="block text-xs font-medium text-slate-700">
                    {WORKBENCH_COPY_RU.inspector.projectTitleLabel}
                  </label>
                  <input
                    id="project-title-input"
                    data-testid="project-title-input"
                    type="text"
                    value={titleDraft}
                    onChange={(event) => setTitleDraft(event.target.value)}
                    onBlur={handleTitleCommit}
                    className="w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1.5 text-[13px] text-slate-900 focus:border-[#2563EB] focus:outline-none"
                  />
                </form>

                <dl className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">{WORKBENCH_COPY_RU.inspector.projectAuthorLabel}</dt>
                    <dd className="font-medium text-slate-800">{document.author}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">{WORKBENCH_COPY_RU.inspector.lifecycleLabel}</dt>
                    <dd className="font-medium text-slate-800">
                      {LIFECYCLE_LABELS_RU[document.lifecycleStatus]}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">{WORKBENCH_COPY_RU.inspector.revisionLabel}</dt>
                    <dd className="font-mono font-medium text-slate-800" data-testid="inspector-revision">
                      {document.revision}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">{WORKBENCH_COPY_RU.inspector.schemaVersionLabel}</dt>
                    <dd className="font-mono text-slate-800">v{document.schemaVersion}</dd>
                  </div>
                </dl>
              </section>

              {activeDiagram && (
                <section
                  aria-labelledby="inspector-diagram-section"
                  className="space-y-2 border-t border-[#E2E8F0] pt-4"
                >
                  <h3
                    id="inspector-diagram-section"
                    className="text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {WORKBENCH_COPY_RU.inspector.diagramSection}
                  </h3>
                  <dl className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-slate-500">{WORKBENCH_COPY_RU.inspector.diagramCodeLabel}</dt>
                      <dd className="font-mono font-semibold text-slate-900">{activeDiagram.code}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-slate-500">{WORKBENCH_COPY_RU.inspector.diagramNotationLabel}</dt>
                      <dd className="font-medium text-slate-800">
                        {NOTATION_LABELS_RU[activeDiagram.notation]}
                      </dd>
                    </div>
                  </dl>
                </section>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Persistent Bottom Model Status Bar (reduces canvas height, never overlaps) */}
      <footer
        data-testid="workbench-status-bar"
        aria-label={WORKBENCH_COPY_RU.statusBar.regionLabel}
        className="shrink-0 border-t border-[#E2E8F0] bg-[#FFFFFF]"
      >
        {statusDrawerOpen && (
          <div
            data-testid="status-bar-drawer"
            className="max-h-44 overflow-y-auto border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800">
                {WORKBENCH_COPY_RU.statusBar.drawerTitle}
              </span>
              <span className="text-[11px] text-slate-500">{WORKBENCH_COPY_RU.statusBar.scopeNote}</span>
            </div>
            {validation.diagnostics.length === 0 ? (
              <p className="text-xs text-slate-600">{WORKBENCH_COPY_RU.statusBar.emptyDiagnostics}</p>
            ) : (
              <ul className="space-y-1 text-xs">
                {validation.diagnostics.map((entry) => (
                  <li key={entry.id} className="rounded border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-1.5">
                    <span className="font-mono text-[11px] text-slate-500">{entry.ruleId}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex h-8 items-center justify-between gap-3 px-3 text-xs">
          <div className="flex items-center gap-2">
            {renderValidationIcon(validation.state)}
            <span data-testid="status-bar-label" className="font-medium text-slate-800">
              {validationLabel}
            </span>
            <span className="hidden text-slate-400 sm:inline">·</span>
            <span className="hidden font-mono text-[11px] text-slate-500 sm:inline">
              {WORKBENCH_COPY_RU.statusBar.revisionPrefix}: {validation.currentRevision}
            </span>
          </div>

          <button
            type="button"
            data-testid="status-bar-toggle"
            aria-expanded={statusDrawerOpen}
            onClick={toggleStatusDrawer}
            className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            <span>
              {statusDrawerOpen
                ? WORKBENCH_COPY_RU.statusBar.hideDetails
                : WORKBENCH_COPY_RU.statusBar.toggleDetails}
            </span>
            {statusDrawerOpen ? (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
