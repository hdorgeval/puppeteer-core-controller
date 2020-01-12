import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('is option available in', (): void => {
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
      "Error: cannot check if option 'bar' is available in 'foo' because a new page has not been created",
    );
    await SUT.isOptionAvailableIn('foo', 'bar', page).catch((error): void =>
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
    await SUT.isOptionAvailableIn('foobar', 'baz', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should detect that option is available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in.test.html')}`);

    // When
    const isAvailable = await SUT.isOptionAvailableIn('#enabledSelect', 'option 2', page);

    // Then
    expect(isAvailable).toBe(true);
  });

  test('should detect that option is not available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in.test.html')}`);

    // When
    const isAvailable = await SUT.isOptionAvailableIn('#enabledSelect', 'option foobar', page);

    // Then
    expect(isAvailable).toBe(false);
  });

  test('should be case sensitive', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in.test.html')}`);

    // When
    const isAvailable1 = await SUT.isOptionAvailableIn('#enabledSelect', 'option 1', page);
    const isAvailable2 = await SUT.isOptionAvailableIn('#enabledSelect', 'Option 1', page);

    // Then
    expect(isAvailable1).toBe(true);
    expect(isAvailable2).toBe(false);
  });

  test('should detect that option is not available in an empty select', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'is-option-available-in.test.html')}`);

    // When
    const isAvailable = await SUT.isOptionAvailableIn('#emptySelect', 'option foobar', page);

    // Then
    expect(isAvailable).toBe(false);
  });
});
