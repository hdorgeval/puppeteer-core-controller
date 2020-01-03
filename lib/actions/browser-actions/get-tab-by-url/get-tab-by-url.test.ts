import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { getChromePath } from '../../../utils';
import { launchBrowser, getCurrentUrl } from '..';

describe('get-existing-tab-in-browser', (): void => {
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
  test('should return an error when browser has not been initalized', async (): Promise<void> => {
    // Given
    browser = undefined;
    const url = 'https://reactstrap.github.io/components/form';
    // When
    // Then
    const expectedError = new Error(
      'Error: cannot get an existing page because the browser has not been launched',
    );
    await SUT.getTabByUrl(browser, url).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return opened page', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    await browser.newPage();
    const page2 = await browser.newPage();
    await page2.goto(url);
    await browser.newPage();

    // When
    const page = await SUT.getTabByUrl(browser, url);

    // Then
    const pageUrl = await getCurrentUrl(page);
    expect(pageUrl).toContain(url);
  });
});
