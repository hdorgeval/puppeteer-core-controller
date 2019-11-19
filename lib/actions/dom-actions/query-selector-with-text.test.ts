import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser, getCurrentUrl } from '../browser-actions';
import { getChromePath } from '../../utils';
import { showMousePosition } from './index';

describe('get client rectangle', (): void => {
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
    const text = 'yo';
    // When
    // Then
    const expectedError = new Error(
      "Error: cannot query selector 'foobar' with text 'yo' because a new page has not been created",
    );
    await SUT.querySelectorWithText('foobar', text, page).catch((error): void =>
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
    const text = 'yo';

    // When

    // Then
    const expectedError = new Error("Error: Cannot find selector 'foobar'");
    await SUT.querySelectorWithText('foobar', text, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an error when text is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const url = 'https://reactstrap.github.io/';
    await page.goto(url);

    const text = 'yo';

    // When

    // Then
    const expectedError = new Error("Error: Cannot find a selector 'a.btn' with text 'yo'");
    await SUT.querySelectorWithText('a.btn', text, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should find selector with text', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await showMousePosition(page);
    const url = 'https://reactstrap.github.io/';
    await page.goto(url);

    const text = 'Components';

    // When
    const result = await SUT.querySelectorWithText('a.btn', text, page);

    // Then
    expect(result).toBeDefined();

    // When
    await result.hover();
    await result.click();
    const resultUrl = await getCurrentUrl(page);

    // Then
    expect(resultUrl).toBe('https://reactstrap.github.io/components/alerts/');
  });
});
