import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../browser-actions';
import { getChromePath } from '../../utils';

describe('wait until selector with text is visible', (): void => {
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
      "Error: cannot wait for selector 'foo' to be visible because a new page has not been created",
    );
    await SUT.waitUntilSelectorWithExactTextIsVisible(
      'foo',
      'bar',
      SUT.defaultWaitOptions,
      page,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
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
    const expectedError = new Error(
      "Error: waiting for selector 'foo' with exact text 'bar' failed: timeout 100ms exceeded",
    );
    await SUT.waitUntilSelectorWithExactTextIsVisible(
      'foo',
      'bar',
      { timeoutInMilliseconds: 100 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });

  test('should return an error when selector with exact text is not found', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When

    // Then
    const expectedError = new Error(
      "Error: waiting for selector 'a.btn' with exact text 'Components!' failed: timeout 5000ms exceeded",
    );
    await SUT.waitUntilSelectorWithExactTextIsVisible(
      'a.btn',
      'Components!',
      { timeoutInMilliseconds: 5000 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });

  test('should find selector with exact text before timeout occurs', async (): Promise<void> => {
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
    await SUT.waitUntilSelectorWithExactTextIsVisible(
      'a.btn',
      'Components',
      SUT.defaultWaitOptions,
      page,
    ).catch((error) => {
      throw error;
    });
  });

  test('should return an error when timeout is too small', async (): Promise<void> => {
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
    const expectedError = new Error(
      "Error: waiting for selector 'a.btn' with exact text 'Components' failed: timeout 1ms exceeded",
    );
    await SUT.waitUntilSelectorWithExactTextIsVisible(
      'a.btn',
      'Components',
      { timeoutInMilliseconds: 1 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });
});
