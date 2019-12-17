import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('has text', (): void => {
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
      "Error: cannot check that 'foo' has text 'bar' because a new page has not been created",
    );
    await SUT.hasText('foo', 'bar', page).catch((error): void =>
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
    const expectedError = new Error('Error: failed to find element matching selector "foo"');
    await SUT.hasText('foo', 'bar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should check that element has not the expected text', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-text.test.html')}`);

    // When
    const result = await SUT.hasText('p#uppercase', 'yo', page);

    // Then
    expect(result).toBe(false);
  });

  test('should check that element has expected text', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-text.test.html')}`);

    // When
    const result = await SUT.hasText('p#uppercase', 'YO', page);

    // Then
    expect(result).toBe(true);
  });

  test('should check that element has no text', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-text.test.html')}`);

    // When
    const result = await SUT.hasText('p#empty', '', page);

    // Then
    expect(result).toBe(true);
  });
});
