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
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      'Error: cannot get parents because a new page has not been created',
    );
    await SUT.getParentsOf([], page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const result = await SUT.getParentsOf([], page);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should get parents', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-parents-of.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getParentsOf(rootElements, page);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(3);
    expect(await result[0].evaluate((node) => (node as HTMLElement).tagName)).toContain('TBODY');
    expect(await result[1].evaluate((node) => (node as HTMLElement).tagName)).toContain('TBODY');
    expect(await result[2].evaluate((node) => (node as HTMLElement).tagName)).toContain('TBODY');
  });

  test('should get parent', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-parents-of.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('select[data-test-id="my-select2"]', page);
    const result = await SUT.getParentsOf(rootElements, page);

    // Then
    expect(rootElements.length).toBe(1);
    expect(result.length).toBe(1);
    expect(await result[0].evaluate((node) => (node as HTMLElement).tagName)).toContain('TD');
  });
  test('should return no elements when parent is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-parents-of.test.html')}`);

    // When
    const rootElements = await querySelectorAllInPage('html', page);
    const result = await SUT.getParentsOf(rootElements, page);

    // Then
    expect(rootElements.length).toBe(1);
    expect(result.length).toBe(0);
  });
});
