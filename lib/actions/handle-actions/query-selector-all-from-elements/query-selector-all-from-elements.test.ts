import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { querySelectorAllInPage } from '../../dom-actions/query-selector-all-in-page';

describe('query selector all from elements', (): void => {
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
    const result = await SUT.querySelectorAllFromElements('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return all found elements', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'query-selector-all-from-elements.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.querySelectorAllFromElements(
      'select[data-test-id="my-select"]',
      rootElements,
    );

    // Then
    expect(result.length).toBe(3);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('1');
    expect(await result[1].evaluate((node) => (node as HTMLSelectElement).value)).toBe('2');
    expect(await result[2].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
  });
  test('should return no elements when child selector is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'query-selector-all-from-elements.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.querySelectorAllFromElements('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(0);
  });
});
