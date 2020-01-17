import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { querySelectorAllInPage } from '../query-selector-all-in-page';

describe('get nth of elements', (): void => {
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
    const result = await SUT.getNthElement(1, []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return first element', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-nth-element.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getNthElement(1, rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(1);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'row1',
    );
  });

  test('should return last element', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-nth-element.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getNthElement(-1, rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(1);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'row3',
    );
  });
  test('should return no element when index is too high', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-nth-element.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getNthElement(10, rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(0);
  });
});
