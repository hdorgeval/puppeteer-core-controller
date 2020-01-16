import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { getValueOf } from '../get-value-of';

describe('paste text', (): void => {
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
      "Error: cannot paste text 'bar' in 'foo' because a new page has not been created",
    );
    await SUT.pasteText('foo', 'bar', page).catch((error): void =>
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
    await SUT.pasteText('foo', 'bar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should paste text', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'paste-text.test.html')}`);
    await page.waitFor(1000);

    // When
    const selector = '#emptyInput';
    await page.click(selector);
    await SUT.pasteText(selector, 'foobar', page);
    const result = await getValueOf(selector, page);

    // Then
    expect(result).toBe('FOOBAR');
  });

  test.skip('should paste text in content-editable element', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: false,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'paste-text.test.html')}`);
    await page.waitFor(1000);

    // When
    const selector = '#target';
    await page.click(selector);
    await SUT.pasteText(selector, 'foobar', page);
    const result = await getValueOf(selector, page);

    // Then
    expect(result).toBe('FOOBAR');
  });
});
