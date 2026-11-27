import type { ModelValidationState } from '@/core/schema/common/diagnostics';
import type { LifecycleStatus, NotationKind } from '@/core/schema/process/notation';

export const NOTATION_LABELS_RU: Record<NotationKind, string> = {
  idef0: 'IDEF0',
  dfd: 'DFD (Гейн — Сарсон)',
  idef3: 'IDEF3 (поток процессов)',
};

export const LIFECYCLE_LABELS_RU: Record<LifecycleStatus, string> = {
  working: 'В работе',
  draft: 'Черновик',
  recommended: 'Рекомендована',
  publication: 'Утверждена',
};

export const WORKBENCH_COPY_RU = {
  appName: 'CASEMODEL',
  appTagline: 'Локальная веб-среда процессного моделирования IDEF0, DFD и IDEF3',
  defaultProjectTitle: 'Новая модель процессов',
  defaultContextActivityTitle: 'Основная деятельность предприятия',
  defaultAuthor: 'Аналитик',
  landing: {
    heading: 'CASEMODEL — локальная среда моделирования процессов',
    subtitle:
      'Инструмент моделирования IDEF0, DFD и IDEF3, работающий полностью в браузере без серверного хранения.',
    openEditor: 'Открыть рабочую область',
    stageBadge: 'Этап 1: базовый каркас редактора',
    principlesTitle: 'Архитектурные основы платформы',
    principles: [
      'Каждая процессная модель начинается с контекстной диаграммы IDEF0 (A-0 / A0).',
      'Нотации DFD и IDEF3 создаются через декомпозицию внутри иерархии IDEF0.',
      'Редактор сохраняет связи с нарушениями нотации и выводит сквозную диагностику в строке состояния.',
      'Все вычисления, хранение и экспорт работают локально без облачных сервисов и ИИ-вызовов.',
    ],
  },
  toolbar: {
    openHome: 'На главную',
    explorerToggle: 'Навигатор модели',
    inspectorToggle: 'Инспектор',
    undo: 'Отменить',
    redo: 'Повторить',
    addBlock: 'Добавить блок',
    decompose: 'Декомпозировать',
    autoLayout: 'Авторасстановка',
    frameToggle: 'Рамка KIT',
    validate: 'Проверить модель',
    exportMenu: 'Экспорт',
  },
  explorer: {
    title: 'Навигатор модели',
    diagramsSection: 'Иерархия диаграмм',
    contextBadge: 'Контекст',
    collapse: 'Свернуть навигатор',
  },
  inspector: {
    title: 'Инспектор',
    projectSection: 'Свойства проекта',
    diagramSection: 'Активная диаграмма',
    projectTitleLabel: 'Название проекта',
    projectAuthorLabel: 'Автор',
    lifecycleLabel: 'Статус жизненного цикла',
    revisionLabel: 'Ревизия документа',
    diagramCodeLabel: 'Код диаграммы',
    diagramNotationLabel: 'Нотация',
    schemaVersionLabel: 'Версия схемы',
    collapse: 'Свернуть инспектор',
  },
  canvas: {
    regionLabel: 'Рабочий холст диаграммы',
    shellNoticeTitle: 'Статический каркас рабочего пространства',
    shellNoticeBody:
      'Корневая модель инициализирована в памяти с контекстом A-0 и блоком A0. Интерактивный холст React Flow и ортогональная трассировка подключаются на этапе 3.',
    contextActivityPrefix: 'A0',
    frameStandardLabel: 'Стандартная рамка (Р 50.1.028-2001 / KIT)',
    frameHiddenLabel: 'Рамка скрыта',
    localFirstBadge: 'Локально в браузере',
  },
  statusBar: {
    regionLabel: 'Строка состояния модели',
    drawerTitle: 'Диагностика по всей модели',
    emptyDiagnostics: 'Нарушений по всем диаграммам модели не обнаружено.',
    retryValidation: 'Повторить проверку',
    toggleDetails: 'Показать список проверок',
    hideDetails: 'Скрыть список проверок',
    revisionPrefix: 'Ревизия',
    scopeNote: 'Область проверки: вся активная процессная модель',
  },
} as const;

export function formatValidationStatusRu(
  state: ModelValidationState,
  errorCount: number,
  warningCount: number,
): string {
  switch (state) {
    case 'checking':
      return 'Проверка модели…';
    case 'errors':
      return `Ошибки: ${errorCount}`;
    case 'warnings':
      return `Предупреждения: ${warningCount}`;
    case 'valid':
      return 'Модель корректна';
    case 'failed':
      return 'Не удалось проверить модель';
  }
}
