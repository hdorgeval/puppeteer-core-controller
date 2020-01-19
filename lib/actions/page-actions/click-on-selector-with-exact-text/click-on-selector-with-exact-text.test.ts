import * as puppeteer from 'puppeteer-core';
import * as SUT from '../index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { hasFocus } from '../../dom-actions';

describe('click on selector with exact text', (): void => {
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
      "Error: cannot click on 'foo' because a new page has not been created",
    );
    await SUT.clickOnSelectorWithExactText(
      'foo',
      'bar',
      SUT.defaultClickOptions,
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
    await SUT.clickOnSelectorWithExactText(
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
    await page.goto(`file:${path.join(__dirname, 'click-on-selector-with-exact-text.test.html')}`);

    // When
    // Then
    const expectedError = new Error(
      "Error: waiting for selector 'label' with exact text 'foobar' failed: timeout 5000ms exceeded",
    );
    await SUT.clickOnSelectorWithExactText(
      'label',
      'foobar',
      { timeoutInMilliseconds: 5000 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });

  test('should click on selector with exact text before timeout occurs', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'click-on-selector-with-exact-text.test.html')}`);

    // When
    await SUT.clickOnSelectorWithExactText('label', 'Email', SUT.defaultClickOptions, page);
    const hasInputEmailFocus = await hasFocus('input#email', page);

    // Then
    expect(hasInputEmailFocus).toBe(true);
  });

  test('should wait for the selector to be visible', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'click-on-selector-with-exact-text.test.html')}`);

    // When
    await SUT.clickOnSelectorWithExactText(
      'p',
      'I am dynamically added in DOM',
      SUT.defaultClickOptions,
      page,
    );
    const hasInputTextFocus = await hasFocus('p[data-e2e="dynamycally-added"]', page);

    // Then
    expect(hasInputTextFocus).toBe(true);
  });

  test('should return an error when timeout is too small', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'click-on-selector-with-exact-text.test.html')}`);
    // When
    // Then
    const expectedError = new Error(
      "Error: waiting for selector 'p' with exact text 'I am dynamically added in DOM' failed: timeout 1000ms exceeded",
    );
    await SUT.clickOnSelectorWithExactText(
      'p',
      'I am dynamically added in DOM',
      { timeoutInMilliseconds: 1000 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });
});
