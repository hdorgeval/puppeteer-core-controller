import * as puppeteer from 'puppeteer-core';
import * as SUT from '../index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { getValueOf } from '../get-value-of';
import { getInnerTextOf } from '../get-innertext-of';
import { clear, defaultClickOptions } from '../../page-actions';

describe('paste text in active element', (): void => {
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
      "Error: cannot paste text 'foo' because a new page has not been created",
    );
    await SUT.pasteTextInActiveElement('foo', SUT.defaultPasteOptions, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an error when there is no active element', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    // Then
    const expectedError = new Error(
      "Cannot paste text 'foo' because there is no active element in the page. You must first click on a selector and then clear it's content before pasting text.",
    );
    await SUT.pasteTextInActiveElement('foo', SUT.defaultPasteOptions, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should paste text in element that already handles the paste event', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'paste-text-in-active-element.test.html')}`);
    await page.waitFor(1000);

    // When
    const selector = '#emptyInput';
    await page.click(selector);
    await clear(selector, defaultClickOptions, page);

    await SUT.pasteTextInActiveElement('foobar', SUT.defaultPasteOptions, page);
    const result = await getValueOf(selector, page);

    // Then
    expect(result).toBe('FOOBAR');
  });

  test('should paste text in content-editable element that do not handle the paste event', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'paste-text-in-active-element.test.html')}`);
    await page.waitFor(1000);

    // When
    const selector = '#target';
    await page.click(selector);
    await clear(selector, defaultClickOptions, page);
    await SUT.pasteTextInActiveElement('foobar', { handlePasteEvent: true }, page);
    const result = await getInnerTextOf(selector, page);

    // Then
    expect(result).toBe('foobar');
  });

  test('should paste text in input element that do not handle the paste event', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'paste-text-in-active-element.test.html')}`);
    await page.waitFor(1000);

    // When
    const selector = '#targetInput';
    await page.click(selector);
    await clear(selector, defaultClickOptions, page);
    await SUT.pasteTextInActiveElement('foobar', { handlePasteEvent: true }, page);
    const result = await getValueOf(selector, page);

    // Then
    expect(result).toBe('foobar');
  });
});
