import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('get client rectangle of an element handle', (): void => {
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
  test('should return null when selector is null', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = null;

    // When
    const result = await SUT.getClientRectangleOfHandle(selector);

    // Then
    expect(result).toBe(null);
  });

  test('should return null when selector is undefined', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = undefined;

    // When
    const result = await SUT.getClientRectangleOfHandle(selector);

    // Then
    expect(result).toBe(null);
  });

  test('should return Client Rectangle', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'get-client-rectangle-of-handle.test.html')}`);

    // When
    const handle = await page.$('#foo');
    const result: ClientRect | null = await SUT.getClientRectangleOfHandle(handle);

    // Then
    const expectedClientRectangle: ClientRect = {
      bottom: 32,
      height: 21,
      left: 12,
      right: 32,
      top: 11,
      width: 20,
    };
    expect(result).not.toBe(null);
    expect(result).toMatchObject(expectedClientRectangle);
  });
});
