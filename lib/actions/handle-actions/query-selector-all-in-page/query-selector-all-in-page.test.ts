import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';

describe('query selector all in page', (): void => {
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
      "Error: cannot query selector 'foobar' because a new page has not been created",
    );
    await SUT.querySelectorAllInPage('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an empty array when selector is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const result = await SUT.querySelectorAllInPage('foobar', page);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return all found elements', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'query-selector-all-in-page.test.html')}`);

    // When
    const result = await SUT.querySelectorAllInPage('[role="row"]', page);

    // Then
    expect(result.length).toBe(3);
    expect((await result[0].getProperty('innerText')).toString()).toContain('row1');
    expect((await result[1].getProperty('innerText')).toString()).toContain('row2');
    expect((await result[2].getProperty('innerText')).toString()).toContain('row3');
  });
});
