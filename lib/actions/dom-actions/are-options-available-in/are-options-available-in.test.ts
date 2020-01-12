import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('are options available in', (): void => {
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
      "Error: cannot check if options [bar] are available in 'foo' because a new page has not been created",
    );
    await SUT.areOptionsAvailableIn('foo', ['bar'], page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an error when options is an empty array', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    // Then
    const expectedError = new Error('No option to check: you must specify at least one option');
    await SUT.areOptionsAvailableIn('foo', [], page).catch((error): void =>
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
    await SUT.areOptionsAvailableIn('foobar', ['baz'], page).catch((error): void =>
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
    await page.goto(`file:${path.join(__dirname, 'are-options-available-in.test.html')}`);

    // When
    const isAvailable = await SUT.areOptionsAvailableIn('#enabledSelect', ['option 2'], page);

    // Then
    expect(isAvailable).toBe(true);
  });

  test('should detect that options are available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'are-options-available-in.test.html')}`);

    // When
    const areAvailable = await SUT.areOptionsAvailableIn(
      '#enabledSelect',
      ['option 2', 'option 1'],
      page,
    );

    // Then
    expect(areAvailable).toBe(true);
  });

  test('should detect that option is not available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'are-options-available-in.test.html')}`);

    // When
    const isAvailable = await SUT.areOptionsAvailableIn('#enabledSelect', ['option foobar'], page);

    // Then
    expect(isAvailable).toBe(false);
  });

  test('should detect that one of the options is not available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'are-options-available-in.test.html')}`);

    // When
    const isAvailable = await SUT.areOptionsAvailableIn(
      '#enabledSelect',
      ['option 1', 'option 2', 'option foobar'],
      page,
    );

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
    await page.goto(`file:${path.join(__dirname, 'are-options-available-in.test.html')}`);

    // When
    const areAvailable1 = await SUT.areOptionsAvailableIn(
      '#enabledSelect',
      ['option 1', 'option 2'],
      page,
    );
    const areAvailable2 = await SUT.areOptionsAvailableIn(
      '#enabledSelect',
      ['Option 1', 'Option 2'],
      page,
    );

    // Then
    expect(areAvailable1).toBe(true);
    expect(areAvailable2).toBe(false);
  });

  test('should detect that options are not available in an empty select', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'are-options-available-in.test.html')}`);

    // When
    const areAvailable = await SUT.areOptionsAvailableIn(
      '#emptySelect',
      ['option 1', 'option 2'],
      page,
    );

    // Then
    expect(areAvailable).toBe(false);
  });
});
