import * as puppeteer from 'puppeteer-core';
import * as SUT from '.';
import { defaultClickOptions } from '..';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { getValueOf } from '../../dom-actions';

describe('clear', (): void => {
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
      "Error: cannot clear 'foobar' because a new page has not been created",
    );
    await SUT.clear('foobar', defaultClickOptions, page).catch((error): void =>
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
    const expectedError = new Error('No node found for selector: foobar');
    await SUT.clear('foobar', defaultClickOptions, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should clear input', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'clear.test.html')}`);

    // When
    await SUT.clear('#enabledInput', defaultClickOptions, page);

    // Then
    const inputValue = await getValueOf('#enabledInput', page);
    expect(inputValue).toBe('');
  });

  test('should not clear disabled input', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'clear.test.html')}`);

    // When
    await SUT.clear('#disabledInput', defaultClickOptions, page);

    // Then
    const inputValue = await getValueOf('#disabledInput', page);
    expect(inputValue).toBe('I am disabled !');
  });
});
