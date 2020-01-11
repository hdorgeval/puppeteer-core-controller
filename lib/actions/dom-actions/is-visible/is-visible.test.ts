import * as puppeteer from 'puppeteer-core';
import * as SUT from '../index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('selector is visible', (): void => {
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
      "Error: cannot check if 'foobar' is visible because a new page has not been created",
    );
    await SUT.isVisible('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return false when selector is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const result = await SUT.isVisible('foobar', page);

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
    await page.goto(`file:${path.join(__dirname, 'is-visible.test1.html')}`);
    await page.waitFor(1000);

    // When
    const result = await SUT.isVisible('#hidden', page);

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is visible', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-visible.test1.html')}`);
    await page.waitFor(1000);

    // When
    const result = await SUT.isVisible('#visible', page);

    // Then
    expect(result).toBe(true);
  });

  test('should return false when selector is transparent', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-visible.test1.html')}`);
    await page.waitFor(1000);

    // When
    const result = await SUT.isVisible('#transparent', page);

    // Then
    expect(result).toBe(false);
  });

  // TODO: activate this test once code is written for this use case
  test.skip('should return false when selector is out of screen', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-visible.test1.html')}`);
    await page.waitFor(1000);

    // When
    const result = await SUT.isVisible('#out-of-screen', page);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector is removed from DOM', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-visible.test1.html')}`);

    // When
    const previousVisibilityStatus = await SUT.isVisible('#visible-then-removed', page);
    await page.waitFor(1000);
    const currentVisibilityStatus = await SUT.isVisible('#visible-then-removed', page);

    // Then
    expect(previousVisibilityStatus).toBe(true);
    expect(currentVisibilityStatus).toBe(false);
  });
});
