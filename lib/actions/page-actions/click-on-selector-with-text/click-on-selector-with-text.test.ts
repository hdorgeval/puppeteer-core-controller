import * as puppeteer from 'puppeteer-core';
import * as SUT from '../index';
import { launchBrowser, getCurrentUrl } from '../../browser-actions';
import { getChromePath } from '../../../utils';

describe('click on selector with text', (): void => {
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
    await SUT.clickOnSelectorWithText(
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
      "Error: waiting for selector 'foo' with text 'bar' failed: timeout 100ms exceeded",
    );
    await SUT.clickOnSelectorWithText(
      'foo',
      'bar',
      { timeoutInMilliseconds: 100 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });

  test('should click on selector with text before timeout occurs', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const url = 'https://reactstrap.github.io/';
    await page.goto(url);

    // When
    await SUT.clickOnSelectorWithText('a.btn', 'Components', SUT.defaultClickOptions, page);

    // Then
    const currentUrl = await getCurrentUrl(page);
    expect(currentUrl).toBe('https://reactstrap.github.io/components/alerts/');
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
      "Error: waiting for selector 'a.btn' with text 'Components' failed: timeout 1ms exceeded",
    );
    await SUT.clickOnSelectorWithText(
      'a.btn',
      'Components',
      { timeoutInMilliseconds: 1 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });
});
