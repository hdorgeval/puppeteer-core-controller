import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('get all options of a select', (): void => {
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
      "Error: cannot get the options of 'foobar' because a new page has not been created",
    );
    await SUT.getAllOptionsOf('foobar', page).catch((error): void =>
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
    await SUT.getAllOptionsOf('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an error when selector is not a select element', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of.test.html')}`);

    // When
    // Then
    const expectedError = new Error("Cannot find any options in selector '#emptyInput'");
    await SUT.getAllOptionsOf('#emptyInput', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return options of a disabled select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of.test.html')}`);

    // When
    const result = await SUT.getAllOptionsOf('#disabledSelect', page);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0].label).toBe('label 1');
    expect(result[0].value).toBe('1');
    expect(result[1].label).toBe('label 2');
    expect(result[1].value).toBe('2');
  });

  test('should return options of an enabled select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of.test.html')}`);

    // When
    const result = await SUT.getAllOptionsOf('#enabledSelect', page);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].label).toBe('');
    expect(result[0].value).toBe('');
    expect(result[0].selected).toBe(true);
    expect(result[1].label).toBe('label 1');
    expect(result[1].value).toBe('value1');
  });

  test('should return empty options of an empty select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-all-options-of.test.html')}`);

    // When
    const result = await SUT.getAllOptionsOf('#no-options', page);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
