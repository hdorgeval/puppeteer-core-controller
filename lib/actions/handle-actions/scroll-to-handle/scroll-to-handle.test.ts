import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { getViewportRectangleOf } from '../../page-actions/get-viewport-rectangle-of';
import { showMousePosition, getClientRectangleOf, isVisible } from '../../dom-actions';

describe('scroll to handle', (): void => {
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
  test('should do nothing when handle is undefined', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    const page = await browser.newPage();
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);

    const handle: puppeteer.ElementHandle<Element> | undefined = undefined;

    // When
    const previousViewportRectangle = await getViewportRectangleOf(page);
    await SUT.scrollToHandle(handle);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousViewportRectangle).toMatchObject(currentViewportRectangle || {});
  });

  test('should do nothing when handle is null', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    const page = await browser.newPage();
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);

    const handle: puppeteer.ElementHandle<Element> | null = null;

    // When
    const previousViewportRectangle = await getViewportRectangleOf(page);
    await SUT.scrollToHandle(handle);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousViewportRectangle).toMatchObject(currentViewportRectangle || {});
  });

  test('should scroll to a visible selector', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    const page = await browser.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);

    await page.waitFor(1000);
    const selector = '#out-of-view-port';
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);
    const isSelectorVisible = await isVisible(selector, page);

    // When
    const handle = await page.$(selector);
    await SUT.scrollToHandle(handle);
    await page.waitFor(2000);
    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(isSelectorVisible).toBe(true);
    expect(previousClientRectangle.top).toBeGreaterThan(currentClientRectangle.top);
    expect(previousViewportRectangle?.pageTop).toBe(0);
    expect(currentViewportRectangle?.pageTop).toBeGreaterThan(1000);
  });

  test('should not scroll to a hidden selector', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    const page = await browser.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);
    await page.waitFor(2000);

    const selector = '#hidden';
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    // When
    const handle = await page.$(selector);
    await SUT.scrollToHandle(handle);
    await page.waitFor(2000);

    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousClientRectangle).toMatchObject(currentClientRectangle);
    expect(previousViewportRectangle?.pageTop).toBe(0);
    expect(currentViewportRectangle).toMatchObject(previousViewportRectangle || {});
  });

  test('should scroll to a transparent selector', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);
    await page.waitFor(2000);

    const selector = '#transparent';
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    // When
    const handle = await page.$(selector);
    await SUT.scrollToHandle(handle);
    await page.waitFor(2000);
    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousClientRectangle.top).toBeGreaterThan(currentClientRectangle.top);
    expect(previousViewportRectangle?.pageTop).toBe(0);
    expect(currentViewportRectangle?.pageTop).toBeGreaterThan(1000);
  });
});
