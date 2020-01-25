import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { PuppeteerController } from '../../../controller';

describe('handle is disabled', (): void => {
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
  test('should return false when handle is undefined', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const handle: puppeteer.ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isHandleDisabled(handle);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const handle: puppeteer.ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isHandleDisabled(handle);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector has no disabled property', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-disabled.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('p');

    // When
    const handle = await selector.getFirstHandleOrNull();
    const result = await SUT.isHandleDisabled(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return false when selector is enabled', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-disabled.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#enabledInput');

    // When
    const handle = await selector.getFirstHandleOrNull();
    const result = await SUT.isHandleDisabled(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector is disabled', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-disabled.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#disabledInput');

    // When
    const handle = await selector.getFirstHandleOrNull();
    const result = await SUT.isHandleDisabled(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector select is disabled', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-disabled.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#disabledSelect');

    // When
    const handle = await selector.getFirstHandleOrNull();
    const result = await SUT.isHandleDisabled(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector select is enabled', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-disabled.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#enabledSelect');

    // When
    const handle = await selector.getFirstHandleOrNull();
    const result = await SUT.isHandleDisabled(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });
});
