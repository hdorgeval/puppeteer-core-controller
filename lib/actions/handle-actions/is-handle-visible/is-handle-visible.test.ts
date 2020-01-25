import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { PuppeteerController } from '../../../controller';

describe('handle is visible', (): void => {
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
    const result = await SUT.isHandleVisible(handle);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector is hidden', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-visible.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#hidden').nth(1);

    // When
    const handles = await selector.getHandles();
    const handle = handles[0];
    const result = await SUT.isHandleVisible(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector is visible', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-visible.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#visible').nth(1);

    // When
    const handles = await selector.getHandles();
    const handle = handles[0];
    const result = await SUT.isHandleVisible(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector is transparent', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-visible.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#transparent').nth(1);

    // When
    const handles = await selector.getHandles();
    const handle = handles[0];
    const result = await SUT.isHandleVisible(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return false when selector is out of screen', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-visible.test.html')}`);
    await page.waitFor(1000);

    const pptc = new PuppeteerController(browser, page);
    const selector = pptc.selector('#out-of-screen').nth(1);

    // When
    const handles = await selector.getHandles();
    const handle = handles[0];
    const result = await SUT.isHandleVisible(handle);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });
});
