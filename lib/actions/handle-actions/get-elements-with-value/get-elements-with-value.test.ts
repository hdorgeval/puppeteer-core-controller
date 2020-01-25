import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { querySelectorAllInPage } from '../query-selector-all-in-page';

describe('get elements with value', (): void => {
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
    const result = await SUT.getElementsWithValue('foobar', []);

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
    await page.goto(`file:${path.join(__dirname, 'get-elements-with-value.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] select', page);
    const result = await SUT.getElementsWithValue('3', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(1);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'label 3 row3',
    );
  });

  test('should return only two elements', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-elements-with-value.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage(
      '[role="row"] select, [role="row"] input',
      page,
    );
    const result = await SUT.getElementsWithValue('2', rootElements);

    // Then
    expect(rootElements.length).toBe(4);
    expect(result.length).toBe(2);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'label 2 row 2',
    );
    expect(
      await result[1].evaluate((node) => (node as HTMLSelectElement).getAttribute('data-e2e')),
    ).toBe('foobar');
  });
  test('should return no elements when value is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-elements-with-value.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage(
      '[role="row"] select, [role="row"] input',
      page,
    );
    const result = await SUT.getElementsWithValue('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(4);
    expect(result.length).toBe(0);
  });
});
