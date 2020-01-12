import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { defaultWaitOptions } from '../wait-options.interfaces';

describe('wait until options are available', (): void => {
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
      "Error: cannot check if option(s) [bar] is available in 'foo' because a new page has not been created",
    );
    await SUT.waitUntilOptionsAreAvailable(
      'foo',
      ['bar'],
      defaultWaitOptions,
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
    const expectedError = new Error('Error: failed to find element matching selector "foo"');
    await SUT.waitUntilOptionsAreAvailable(
      'foo',
      ['bar'],
      { timeoutInMilliseconds: 100 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });

  test('should wait until option is available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    const startTime = new Date().getTime();
    await page.goto(`file:${path.join(__dirname, 'wait-until-options-are-available.test.html')}`);

    // When
    await SUT.waitUntilOptionsAreAvailable(
      '#enabledSelect',
      ['label foo'],
      defaultWaitOptions,
      page,
    );
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(duration).toBeGreaterThan(500);
  });

  test('should wait until options are available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    const startTime = new Date().getTime();
    await page.goto(`file:${path.join(__dirname, 'wait-until-options-are-available.test.html')}`);

    // When
    await SUT.waitUntilOptionsAreAvailable(
      '#enabledSelect',
      ['label foo', 'label bar'],
      defaultWaitOptions,
      page,
    );
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(duration).toBeGreaterThan(1000);
  });

  test('should return an error when timeout is too small', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'wait-until-options-are-available.test.html')}`);

    // When
    // Then
    const expectedError = new Error(
      "Error: option(s) [label bar] is still missing in '#enabledSelect' after 100 ms",
    );
    await SUT.waitUntilOptionsAreAvailable(
      '#enabledSelect',
      ['label bar'],
      { timeoutInMilliseconds: 100 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });
});
