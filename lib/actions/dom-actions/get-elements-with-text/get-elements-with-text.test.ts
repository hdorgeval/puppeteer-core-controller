import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { querySelectorAllInPage } from '../query-selector-all-in-page';

describe('get elements with text', (): void => {
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

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    // When
    const result = await SUT.getElementsWithText('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return only one element', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-elements-with-text.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getElementsWithText('row2', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(1);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'row2',
    );
  });

  test('should return only two elements', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-elements-with-text.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getElementsWithText('cell3', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(2);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'row2-cell2',
    );
    expect(await result[1].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'row3-cell2',
    );
  });
  test('should return no elements when text is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-elements-with-text.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getElementsWithText('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(0);
  });
});
