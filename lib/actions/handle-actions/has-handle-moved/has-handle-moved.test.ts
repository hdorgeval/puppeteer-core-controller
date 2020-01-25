import * as puppeteer from 'puppeteer-core';
import * as SUT from '../index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { zeroClientRectangle } from '../../dom-actions/index';

describe('selector has moved', (): void => {
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
    const result = await SUT.hasHandleMoved(handle, zeroClientRectangle);

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
    const result = await SUT.hasHandleMoved(handle, zeroClientRectangle);

    // Then
    expect(result).toBe(false);
  });
  test('should detect that selector has moved', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-handle-moved.test1.html')}`);
    const handle = await page.$('#moving');
    const previousClientRectangle = await SUT.getClientRectangleOfHandle(handle);
    await page.waitFor(200);

    // When
    const hasMoved = await SUT.hasHandleMoved(
      handle,
      previousClientRectangle || zeroClientRectangle,
    );

    // Then
    expect(handle).not.toBe(null);
    expect(previousClientRectangle).not.toBe(null);
    expect(hasMoved).toBe(true);
  });

  test('should detect that selector does not move', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-handle-moved.test2.html')}`);
    const handle = await page.$('#moving');
    await page.waitFor(2000); // wait twice the animation duration
    const previousClientRectangle = await SUT.getClientRectangleOfHandle(handle);

    // When
    const hasMoved = await SUT.hasHandleMoved(
      handle,
      previousClientRectangle || zeroClientRectangle,
    );

    // Then
    expect(handle).not.toBe(null);
    expect(previousClientRectangle).not.toBe(null);
    expect(hasMoved).toBe(false);
  });
});
