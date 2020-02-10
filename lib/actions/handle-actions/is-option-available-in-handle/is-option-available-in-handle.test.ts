import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('is option available in selector handle', (): void => {
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
  test('should return false when when selector is null', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = null;

    // When
    const result = await SUT.isOptionAvailableInHandle(selector, 'foobar');

    // Then
    expect(result).toBe(false);
  });

  test('should return false when when selector is undefined', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = undefined;

    // When
    const result = await SUT.isOptionAvailableInHandle(selector, 'foobar');

    // Then
    expect(result).toBe(false);
  });

  test('should detect that option is available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`);

    // When
    const selector = await page.$('#enabledSelect');
    const isAvailable = await SUT.isOptionAvailableInHandle(selector, 'option 2');

    // Then
    expect(isAvailable).toBe(true);
  });

  test('should detect that option is not available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`);

    // When
    const selector = await page.$('#enabledSelect');
    const isAvailable = await SUT.isOptionAvailableInHandle(selector, 'option foobar');

    // Then
    expect(isAvailable).toBe(false);
  });

  test('should detect that empty option is available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`);

    // When
    const selector = await page.$('#enabledSelect');
    const isAvailable = await SUT.isOptionAvailableInHandle(selector, '');

    // Then
    expect(isAvailable).toBe(true);
  });

  test('should detect that empty option is not available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`);

    // When
    const selector = await page.$('#disabledSelect');
    const isAvailable = await SUT.isOptionAvailableInHandle(selector, '');

    // Then
    expect(isAvailable).toBe(false);
  });

  test('should be case sensitive', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`);

    // When
    const selector = await page.$('#enabledSelect');
    const isAvailable1 = await SUT.isOptionAvailableInHandle(selector, 'option 1');
    const isAvailable2 = await SUT.isOptionAvailableInHandle(selector, 'Option 1');

    // Then
    expect(isAvailable1).toBe(true);
    expect(isAvailable2).toBe(false);
  });

  test('should detect that option is not available in an empty select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`);

    // When
    const selector = await page.$('#emptySelect');
    const isAvailable = await SUT.isOptionAvailableInHandle(selector, 'option foobar');

    // Then
    expect(isAvailable).toBe(false);
  });
});
