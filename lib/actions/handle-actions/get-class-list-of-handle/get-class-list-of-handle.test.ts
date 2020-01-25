import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('get class list of handle', (): void => {
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
  test('should return empty array when selector is null', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = null;

    // When
    const result = await SUT.getClassListOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return empty array when selector is undefined', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = undefined;

    // When
    const result = await SUT.getClassListOfHandle(selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return empty array when class attribute has no value', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`);

    // When
    const handle = await page.$('#with-empty-class');
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return empty array when class attribute is empty', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`);

    // When
    const handle = await page.$('#with-empty-class-2');
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return empty array when class attribute does not exist', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`);

    // When
    const handle = await page.$('#with-no-class');
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return class list with one item', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`);

    // When
    const handle = await page.$('#with-one-class');
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('foo');
  });

  test('should return class list with two items', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`);

    // When
    const handle = await page.$('#with-two-classes');
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toBe('foo');
    expect(result[1]).toBe('bar');
  });
});
