import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('handle is moving', (): void => {
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

    const page = await browser.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-moving.test1.html')}`;
    await page.goto(url);

    const handle: puppeteer.ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isHandleMoving(handle);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    const page = await browser.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-moving.test1.html')}`;
    await page.goto(url);

    const handle: puppeteer.ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isHandleMoving(handle);

    // Then
    expect(result).toBe(false);
  });
  test('should detect that selector is moving', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-moving.test1.html')}`);
    await page.waitFor(100); // wait for the animation to be started

    // When
    const selector = '#moving';
    const handle = await page.$(selector);
    const isMoving = await SUT.isHandleMoving(handle);

    // Then
    expect(isMoving).toBe(true);
  });

  test('should detect that selector is not moving', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-handle-moving.test2.html')}`);
    await page.waitFor(2000); // wait twice the animation duration

    // When
    const handle = await page.$('#moving');
    const isMoving = await SUT.isHandleMoving(handle);

    // Then
    expect(isMoving).toBe(false);
  });
});
