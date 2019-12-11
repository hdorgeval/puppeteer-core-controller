import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../browser-actions';
import { getChromePath } from '../../utils';
import * as path from 'path';

describe('has value', (): void => {
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
      "Error: cannot check that 'foo' has value 'bar' because a new page has not been created",
    );
    await SUT.hasExactValue('foo', 'bar', page).catch((error): void =>
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
    await SUT.hasExactValue('foo', 'bar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should check that input element has not the expected value', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const url = 'https://reactstrap.github.io/';
    await page.goto(url);

    // When
    const inputSelector = 'input[placeholder="Search docs"]';
    const result = await SUT.hasExactValue(inputSelector, 'yo', page);

    // Then
    expect(result).toBe(false);
  });

  test('should check that input element has expected value', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const url = 'https://reactstrap.github.io/';
    await page.goto(url);

    // When
    const inputSelector = 'input[placeholder="Search docs"]';
    await page.click(inputSelector);
    await page.type(inputSelector, ' yo ');
    const result = await SUT.hasExactValue(inputSelector, 'yo', page);

    // Then
    expect(result).toBe(true);
  });

  test('should return an error when selector has no value property', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const url = 'https://reactstrap.github.io/';
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error("Error: Selector 'a.btn' has no value property");
    await SUT.hasExactValue('a.btn', 'bar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should expect undefined value on input field', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-exact-value.test.html')}`);

    // When
    const result = await SUT.hasExactValue('#undefinedInput', '', page);

    // Then
    expect(result).toBe(false);
  });

  test('should expect undefined value on non input field', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-exact-value.test.html')}`);

    // When
    const result = await SUT.hasExactValue('#withUndefinedValue', '', page);

    // Then
    expect(result).toBe(true);
  });

  test('should expect null value on non input field', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-exact-value.test.html')}`);

    // When
    const result = await SUT.hasExactValue('#withNullValue', '', page);

    // Then
    expect(result).toBe(true);
  });
});
