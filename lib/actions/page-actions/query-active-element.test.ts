import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../browser-actions';
import { getChromePath } from '../../utils';

describe('query active element', (): void => {
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
      'Error: cannot query active element because a new page has not been created',
    );
    await SUT.queryActiveElement(page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return null on a blank page', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const result = await SUT.queryActiveElement(page);

    // Then
    expect(result).toBeNull();
  });

  test.only('should return null on a page whith no active element', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const url = 'https://reactstrap.github.io/';
    await page.goto(url);

    // When
    const result = await SUT.queryActiveElement(page);

    // Then
    expect(result).toBeNull();
  });
});
