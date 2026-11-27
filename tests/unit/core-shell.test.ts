import { describe, expect, it } from 'vitest';
import {
  createInitialWorkbenchDocument,
  renameWorkbenchDocument,
} from '@/application/workbench';
import { createBootstrapDocument, renameBootstrapDocument } from '@/core/engine/shell';
import { createEmptyDrawingScene } from '@/core/generators/scene';
import { rectsOverlap } from '@/core/layout/bounds';
import type { ClockPort, IdGeneratorPort } from '@/core/ports/runtime';
import type { DiagnosticEntry } from '@/core/schema/common/diagnostics';
import { diagramIdSchema } from '@/core/schema/common/ids';
import { checkSchemaHeader, CURRENT_SCHEMA_VERSION, SUPPORTED_FORMAT_ID } from '@/core/schema/migrations';
import { summarizeModelValidation } from '@/core/validators/status';
import { WORKBENCH_COPY_RU, formatValidationStatusRu } from '@/i18n/ru';
import { createWorkbenchStore } from '@/store/workbench-store';

function createDeterministicPorts(): { clock: ClockPort; ids: IdGeneratorPort } {
  let seq = 0;
  return {
    clock: { nowIso: () => '2026-11-27T12:00:00.000Z' },
    ids: { nextId: (prefix) => `${prefix}_${++seq}` },
  };
}

describe('stage 1 domain shell & application wiring', () => {
  it('creates deterministic IDEF0 A-0 bootstrap documents from injected ports', () => {
    const portsA = createDeterministicPorts();
    const portsB = createDeterministicPorts();

    const docA = createInitialWorkbenchDocument(portsA, {
      title: 'Тестовая модель',
      contextActivityTitle: 'Контекстный блок',
      author: 'Кирилл',
    });
    const docB = createInitialWorkbenchDocument(portsB, {
      title: 'Тестовая модель',
      contextActivityTitle: 'Контекстный блок',
      author: 'Кирилл',
    });

    expect(docA).toEqual(docB);
    expect(docA.revision).toBe(1);
    expect(docA.diagrams).toHaveLength(1);
    expect(docA.diagrams[0]?.code).toBe('A-0');
    expect(docA.diagrams[0]?.notation).toBe('idef0');
    expect(docA.diagrams[0]?.isContext).toBe(true);
  });

  it('renames documents immutably and ignores empty or identical titles', () => {
    const initial = createBootstrapDocument({
      projectIdRaw: 'prj_1',
      modelIdRaw: 'mdl_1',
      rootDiagramIdRaw: 'dgm_1',
      contextActivityIdRaw: 'nod_1',
      updatedAtIso: '2026-11-27T10:00:00.000Z',
      title: 'Исходное имя',
      contextActivityTitle: 'A0',
      author: 'Аналитик',
    });

    expect(renameBootstrapDocument(initial, '   ', '2026-11-27T10:05:00.000Z')).toBe(initial);
    expect(renameBootstrapDocument(initial, 'Исходное имя', '2026-11-27T10:05:00.000Z')).toBe(initial);

    const renamed = renameWorkbenchDocument(initial, '  Обновлённая модель  ', {
      nowIso: () => '2026-11-27T10:10:00.000Z',
    });
    expect(renamed).not.toBe(initial);
    expect(renamed.title).toBe('Обновлённая модель');
    expect(renamed.revision).toBe(2);
    expect(initial.title).toBe('Исходное имя');
  });

  it('reports green valid state only when current revision is checked cleanly', () => {
    const diagramId = diagramIdSchema.parse('dgm_1');
    const warning: DiagnosticEntry = {
      id: 'diag_1',
      ruleId: 'IDEF0-002',
      severity: 'warning',
      scope: 'diagram',
      diagramId,
      revision: 2,
      messageKey: 'diagram.idef0.block-count-range',
      params: { count: 1 },
    };

    expect(summarizeModelValidation([], null, 1, false).state).toBe('checking');
    expect(summarizeModelValidation([], 1, 2, false).state).toBe('checking');
    expect(summarizeModelValidation([], 2, 2, false).state).toBe('valid');
    expect(summarizeModelValidation([warning], 2, 2, false).state).toBe('warnings');
    expect(summarizeModelValidation([warning], 2, 2, true).state).toBe('failed');
  });

  it('validates schema headers and rejects unknown future versions', () => {
    expect(checkSchemaHeader(SUPPORTED_FORMAT_ID, CURRENT_SCHEMA_VERSION)).toEqual({
      ok: true,
      schemaVersion: 1,
    });
    expect(checkSchemaHeader('legacy.bp1', 1)).toEqual({
      ok: false,
      reason: 'unsupported_format',
    });
    expect(checkSchemaHeader(SUPPORTED_FORMAT_ID, 99)).toEqual({
      ok: false,
      reason: 'unsupported_future_version',
    });
  });

  it('provides pure geometry and empty scene helpers', () => {
    expect(
      rectsOverlap({ x: 0, y: 0, width: 100, height: 60 }, { x: 90, y: 50, width: 40, height: 40 }),
    ).toBe(true);
    expect(
      rectsOverlap({ x: 0, y: 0, width: 100, height: 60 }, { x: 100, y: 0, width: 40, height: 40 }),
    ).toBe(false);

    const scene = createEmptyDrawingScene(diagramIdSchema.parse('dgm_a0'), 1);
    expect(scene.nodes).toEqual([]);
    expect(scene.paths).toEqual([]);
  });

  it('tracks only document slice in zundo undo/redo history', () => {
    const ports = createDeterministicPorts();
    const initial = createInitialWorkbenchDocument(ports, {
      title: 'Первая версия',
      contextActivityTitle: 'A0',
      author: 'Аналитик',
    });
    const store = createWorkbenchStore(initial);

    store.getState().toggleExplorer();
    expect(store.temporal.getState().pastStates).toHaveLength(0);

    const renamed = renameWorkbenchDocument(store.getState().document, 'Вторая версия', ports.clock);
    store.getState().applyDocument(renamed);

    expect(store.getState().document.title).toBe('Вторая версия');
    expect(store.temporal.getState().pastStates).toHaveLength(1);

    store.temporal.getState().undo();
    expect(store.getState().document.title).toBe('Первая версия');

    store.temporal.getState().redo();
    expect(store.getState().document.title).toBe('Вторая версия');
  });

  it('formats Russian status bar labels', () => {
    expect(formatValidationStatusRu('checking', 0, 0)).toBe('Проверка модели…');
    expect(formatValidationStatusRu('errors', 3, 1)).toBe('Ошибки: 3');
    expect(formatValidationStatusRu('warnings', 0, 2)).toBe('Предупреждения: 2');
    expect(formatValidationStatusRu('valid', 0, 0)).toBe('Модель корректна');
    expect(formatValidationStatusRu('failed', 0, 0)).toBe('Не удалось проверить модель');
    expect(WORKBENCH_COPY_RU.appName).toBe('CASEMODEL');
  });
});
