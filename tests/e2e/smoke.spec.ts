import { expect, test, type Page } from '@playwright/test';

function trackRuntimeErrors(page: Page): () => void {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  const onPageError = (error: Error) => {
    pageErrors.push(error.message);
  };
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  return () => {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
    expect(pageErrors, `Uncaught pageerror events: ${pageErrors.join('; ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join('; ')}`).toEqual([]);
  };
}

test.describe('Stage 1 static shell smoke', () => {
  test('opens landing page and navigates to Russian /editor/ shell', async ({ page }) => {
    const assertClean = trackRuntimeErrors(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('CASEMODEL');

    await page.getByTestId('open-editor-link').click();
    await expect(page).toHaveURL(/\/editor\/$/);
    await expect(page.getByTestId('workbench-root')).toBeVisible();

    assertClean();
  });

  test('renders workbench regions, bundled Inter font, panels, status bar, and undo/redo', async ({
    page,
  }) => {
    const assertClean = trackRuntimeErrors(page);

    await page.goto('/editor/');

    await expect(page.getByTestId('workbench-toolbar')).toBeVisible();
    await expect(page.getByTestId('workbench-explorer')).toBeVisible();
    await expect(page.getByTestId('workbench-canvas')).toBeVisible();
    await expect(page.getByTestId('workbench-inspector')).toBeVisible();
    await expect(page.getByTestId('workbench-status-bar')).toBeVisible();
    await expect(page.getByTestId('context-activity-preview')).toContainText('A0');
    await expect(page.getByTestId('status-bar-label')).toHaveText('Модель корректна');

    const fontLoaded = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('13px "Inter"');
    });
    expect(fontLoaded).toBe(true);

    // Toggle status drawer
    await page.getByTestId('status-bar-toggle').click();
    await expect(page.getByTestId('status-bar-drawer')).toBeVisible();
    await page.getByTestId('status-bar-toggle').click();
    await expect(page.getByTestId('status-bar-drawer')).toBeHidden();

    // Collapse and restore explorer and inspector
    await page.getByTestId('toggle-explorer-button').click();
    await expect(page.getByTestId('workbench-explorer')).toBeHidden();
    await page.getByTestId('toggle-explorer-button').click();
    await expect(page.getByTestId('workbench-explorer')).toBeVisible();

    await page.getByTestId('toggle-inspector-button').click();
    await expect(page.getByTestId('workbench-inspector')).toBeHidden();
    await page.getByTestId('toggle-inspector-button').click();
    await expect(page.getByTestId('workbench-inspector')).toBeVisible();

    // Rename project and verify undo / redo
    const titleInput = page.getByTestId('project-title-input');
    await titleInput.fill('Производственный цикл');
    await titleInput.press('Enter');

    await expect(page.getByTestId('toolbar-project-title')).toHaveText('Производственный цикл');
    await expect(page.getByTestId('inspector-revision')).toHaveText('2');
    await expect(page.getByTestId('status-bar-label')).toHaveText('Модель корректна');

    await page.getByTestId('undo-button').click();
    await expect(page.getByTestId('toolbar-project-title')).toHaveText('Новая модель процессов');
    await expect(page.getByTestId('inspector-revision')).toHaveText('1');

    await page.getByTestId('redo-button').click();
    await expect(page.getByTestId('toolbar-project-title')).toHaveText('Производственный цикл');
    await expect(page.getByTestId('inspector-revision')).toHaveText('2');

    assertClean();
  });

  test('keeps status bar visible on narrow screens', async ({ page }) => {
    const assertClean = trackRuntimeErrors(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/editor/');

    await expect(page.getByTestId('workbench-status-bar')).toBeVisible();
    const statusBox = await page.getByTestId('workbench-status-bar').boundingBox();
    expect(statusBox).not.toBeNull();
    expect((statusBox?.y ?? 0) + (statusBox?.height ?? 0)).toBeLessThanOrEqual(844);

    assertClean();
  });
});
