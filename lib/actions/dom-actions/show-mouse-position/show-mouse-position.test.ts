import * as puppeteer from 'puppeteer-core';
import { getChromePath } from '../../../utils';
import { launchBrowser, exists } from '../..';
import { showMousePosition } from './show-mouse-position';

describe('show-mouse-position', (): void => {
  let browser: puppeteer.Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );

  test('should show cursor on the page', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    await showMousePosition(page);
    await page.goto(url);

    // Then
    const cursorExists = await exists('puppeteer-mouse-pointer', page);
    expect(cursorExists).toBe(true);
  });
});
