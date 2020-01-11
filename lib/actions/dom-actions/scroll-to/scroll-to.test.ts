import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { getClientRectangleOf } from '../get-client-rectangle-of';
import { showMousePosition } from '../show-mouse-position';
import { getViewportRectangleOf } from '../../page-actions/get-viewport-rectangle-of';
import { isVisible } from '../is-visible';

describe('scroll to', (): void => {
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
      "Error: cannot scroll to 'foobar' because a new page has not been created",
    );
    await SUT.scrollTo('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an error when selector is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When

    // Then
    const expectedError = new Error('Error: failed to find element matching selector "foobar"');
    await SUT.scrollTo('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should scroll to a visible selector', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await showMousePosition(page);
    await page.goto(`file:${path.join(__dirname, 'scroll-to.test.html')}`);
    await page.waitFor(1000);
    const selector = '#out-of-view-port';
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);
    const isSelectorVisible = await isVisible(selector, page);

    // When
    await SUT.scrollTo(selector, page);
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
    await page.goto(`file:${path.join(__dirname, 'scroll-to.test.html')}`);
    await page.waitFor(2000);
    const selector = '#hidden';
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    // When
    await SUT.scrollTo(selector, page);
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
    await page.goto(`file:${path.join(__dirname, 'scroll-to.test.html')}`);
    await page.waitFor(2000);
    const selector = '#transparent';
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    // When
    await SUT.scrollTo(selector, page);
    await page.waitFor(2000);
    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousClientRectangle.top).toBeGreaterThan(currentClientRectangle.top);
    expect(previousViewportRectangle?.pageTop).toBe(0);
    expect(currentViewportRectangle?.pageTop).toBeGreaterThan(1000);
  });

  test.skip('scrolling to a near-to-be-removed selector', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await showMousePosition(page);
    await page.goto(`file:${path.join(__dirname, 'scroll-to.test.html')}`);
    const selector = '#visible-then-removed';
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    // When
    await SUT.scrollTo(selector, page);
    await page.waitFor(2000);
    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousClientRectangle.top).toBeGreaterThan(currentClientRectangle.top);
    expect(previousViewportRectangle?.pageTop).toBe(0);
    expect(currentViewportRectangle?.pageTop).toBeGreaterThan(1000);
  });
});
