import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../browser-actions';
import { getChromePath } from '../../utils';
import * as path from 'path';

describe('wait until selector does not move', (): void => {
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
      "Error: cannot wait for selector 'foo' to not move because a new page has not been created",
    );
    await SUT.waitUntilSelectorDoesNotMove(
      'foo',
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
    const expectedError = new Error('Error: failed to find element matching selector "foo"');
    await SUT.waitUntilSelectorDoesNotMove(
      'foo',
      { timeoutInMilliseconds: 100 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });

  test('should wait until selector does not move', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const animationDuration = 1000;

    const startTime = new Date().getTime();
    await page.goto(`file:${path.join(__dirname, 'wait-until-selector-does-not-move.test1.html')}`);

    // When
    await SUT.waitUntilSelectorDoesNotMove('#moving', SUT.defaultWaitOptions, page);
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(duration).toBeGreaterThan(animationDuration);
  });

  test('should return an error when timeout is too small', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'wait-until-selector-does-not-move.test1.html')}`);

    // When
    // Then
    const expectedError = new Error("Error: Selector '#moving' is still moving after 100 ms");
    await SUT.waitUntilSelectorDoesNotMove(
      '#moving',
      { timeoutInMilliseconds: 100 },
      page,
    ).catch((error): void => expect(error.message).toBe(expectedError.message));
  });
});
