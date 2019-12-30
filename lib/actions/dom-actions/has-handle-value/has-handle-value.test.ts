import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { PuppeteerController } from '../../../controller';

describe('handle has value', (): void => {
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
    const result = await SUT.hasHandleValue(handle, 'foobar');

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
    const result = await SUT.hasHandleValue(handle, 'foobar');

    // Then
    expect(result).toBe(false);
  });

  test('should return true when handle is null and expected value is empty', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const handle: puppeteer.ElementHandle<Element> | null = null;

    // When
    const result = await SUT.hasHandleValue(handle, '');

    // Then
    expect(result).toBe(true);
  });

  test('should return true when handle is undefined and expected value is empty', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const handle: puppeteer.ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.hasHandleValue(handle, '');

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector has value', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-handle-value.test.html')}`);
    await page.waitFor(1000);

    const inputSelector = '#emptyInput';
    await page.click(inputSelector);
    await page.type(inputSelector, ' yo ');

    // When
    const pptc = new PuppeteerController(browser, page);
    const selector = await pptc
      .selector('input')
      .nth(1)
      .getFirstHandleOrNull();

    const result = await SUT.hasHandleValue(selector, 'yo');

    // Then
    expect(selector).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector has not the value', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-handle-value.test.html')}`);
    await page.waitFor(1000);

    const inputSelector = '#emptyInput';
    await page.click(inputSelector);
    await page.type(inputSelector, ' yo ');

    // When
    const pptc = new PuppeteerController(browser, page);
    const selector = await pptc
      .selector('input')
      .nth(1)
      .getFirstHandleOrNull();

    const result = await SUT.hasHandleValue(selector, 'foobar');

    // Then
    expect(selector).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector has undefined value and expected is empty', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-handle-value.test.html')}`);
    await page.waitFor(1000);

    // When
    const pptc = new PuppeteerController(browser, page);
    const selector = await pptc.selector('#withUndefinedValue').getFirstHandleOrNull();

    const result = await SUT.hasHandleValue(selector, '');

    // Then
    expect(selector).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector has empty value and expected is empty', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-handle-value.test.html')}`);
    await page.waitFor(1000);

    // When
    const pptc = new PuppeteerController(browser, page);
    const selector = await pptc.selector('#emptyInput').getFirstHandleOrNull();

    const result = await SUT.hasHandleValue(selector, '');

    // Then
    expect(selector).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector has null value and expected is empty', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-handle-value.test.html')}`);
    await page.waitFor(1000);

    // When
    const pptc = new PuppeteerController(browser, page);
    const selector = await pptc.selector('#withNullValue').getFirstHandleOrNull();

    const result = await SUT.hasHandleValue(selector, '');

    // Then
    expect(selector).toBeDefined();
    expect(result).toBe(true);
  });
});
