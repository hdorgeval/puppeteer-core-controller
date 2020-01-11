import * as puppeteer from 'puppeteer-core';
import { getChromePath } from '../../../utils';
import { launchBrowser, showMousePosition } from '../..';
import * as SUT from '../index';
import { getClientRectangleOf } from '../../dom-actions';
import * as path from 'path';

describe('hover', (): void => {
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

  test('should hover on an element already inside the viewport', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const selector = 'input#in-view-port';

    // When
    await showMousePosition(page);
    await page.goto(`file:${path.join(__dirname, 'hover.test.html')}`);
    await SUT.hover(selector, SUT.defaultHoverOptions, page);

    // Then
    const emailInputClienttRectangle = await getClientRectangleOf(selector, page);
    const expectedX = emailInputClienttRectangle.left + emailInputClienttRectangle.width / 2;
    const expectedY = emailInputClienttRectangle.top + emailInputClienttRectangle.height / 2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._x - expectedX)).toBeLessThan(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._y - expectedY)).toBeLessThan(1);
  });

  test('should hover on an element outside the viewport', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const selector = 'input#out-of-view-port';

    // When
    await showMousePosition(page);
    await page.goto(`file:${path.join(__dirname, 'hover.test.html')}`);
    await SUT.hover(selector, SUT.defaultHoverOptions, page);

    // Then
    const emailInputClienttRectangle = await getClientRectangleOf(selector, page);
    const expectedX = emailInputClienttRectangle.left + emailInputClienttRectangle.width / 2;
    const expectedY = emailInputClienttRectangle.top + emailInputClienttRectangle.height / 2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._x - expectedX)).toBeLessThan(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._y - expectedY)).toBeLessThan(1);
  });
});
