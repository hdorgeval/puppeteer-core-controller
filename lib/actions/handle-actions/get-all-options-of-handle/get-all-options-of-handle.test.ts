import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('get all options of a select handle', (): void => {
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
  test('should return empty array when when selector is null', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = null;

    // When
    const result = await SUT.getAllOptionsOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return empty array when when selector is undefined', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = undefined;

    // When
    const result = await SUT.getAllOptionsOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return empty array when selector is not a select element', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`);

    // When
    const selector = await page.$('#emptyInput');
    const result = await SUT.getAllOptionsOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return options of a disabled select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`);

    // When
    const selector = await page.$('#disabledSelect');
    const result = await SUT.getAllOptionsOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0].label).toBe('label 1');
    expect(result[0].value).toBe('value 1');
    expect(result[1].label).toBe('label 2');
    expect(result[1].value).toBe('value 2');
  });

  test('should return options of an enabled select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`);

    // When
    const selector = await page.$('#enabledSelect');
    const result = await SUT.getAllOptionsOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    // first option
    expect(result[0].label).toBe('');
    expect(result[0].value).toBe('');
    expect(result[0].selected).toBe(true);
    // second option
    expect(result[1].label).toBe('label 1');
    expect(result[1].value).toBe('value 1');
    expect(result[1].selected).toBe(false);
    // third option
    expect(result[2].label).toBe('label 2');
    expect(result[2].value).toBe('value 2');
    expect(result[2].selected).toBe(false);
  });

  test('should return empty options of an empty select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`);

    // When
    const selector = await page.$('#no-options');
    const result = await SUT.getAllOptionsOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
