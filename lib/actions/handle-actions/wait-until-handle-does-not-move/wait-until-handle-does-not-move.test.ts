import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { defaultWaitOptions } from '../../page-actions';

describe('wait until handle does not move', (): void => {
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
  test('should do nothing when handle is undefined', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    const page = await browser.newPage();
    const url = `file:${path.join(__dirname, 'wait-until-handle-does-not-move.test.html')}`;
    await page.goto(url);

    const handle: puppeteer.ElementHandle<Element> | undefined = undefined;

    // When
    const startTime = new Date().getTime();
    await SUT.waitUntilHandleDoesNotMove(handle, '', defaultWaitOptions);
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(10);
  });

  test('should do nothing when handle is null', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });

    const page = await browser.newPage();
    const url = `file:${path.join(__dirname, 'wait-until-handle-does-not-move.test.html')}`;
    await page.goto(url);

    const handle: puppeteer.ElementHandle<Element> | null = null;

    // When
    const startTime = new Date().getTime();
    await SUT.waitUntilHandleDoesNotMove(handle, '', defaultWaitOptions);
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(10);
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
    await page.goto(`file:${path.join(__dirname, 'wait-until-handle-does-not-move.test.html')}`);

    // When
    const selector = '#moving';
    const handle = await page.$(selector);
    await SUT.waitUntilHandleDoesNotMove(handle, selector, defaultWaitOptions);
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
    await page.goto(`file:${path.join(__dirname, 'wait-until-handle-does-not-move.test.html')}`);

    // When
    // Then
    const selector = '#moving';
    const handle = await page.$(selector);
    const expectedError = new Error("Error: Selector '#moving' is still moving after 100 ms");
    await SUT.waitUntilHandleDoesNotMove(handle, selector, {
      timeoutInMilliseconds: 100,
    }).catch((error): void => expect(error.message).toBe(expectedError.message));
  });
});
