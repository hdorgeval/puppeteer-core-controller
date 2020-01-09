import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { getClientRectangleOf } from '../get-client-rectangle-of';
import { showMousePosition } from '../show-mouse-position';

describe('scroll to', (): void => {
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
      "Error: cannot scroll to 'foobar' because a new page has not been created",
    );
    await SUT.scrollTo('foobar', page).catch((error): void =>
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

    // When

    // Then
    const expectedError = new Error('Error: failed to find element matching selector "foobar"');
    await SUT.scrollTo('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should scroll to a visible selector', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await showMousePosition(page);
    await page.goto(`file:${path.join(__dirname, 'scroll-to.test.html')}`);
    await page.waitFor(1000);
    const selector = '#out-of-view-port';

    // When
    const previousClientRectangle = await getClientRectangleOf(selector, page);
    await SUT.scrollTo(selector, page);
    const currentClientRectangle = await getClientRectangleOf(selector, page);

    // Then
    expect(previousClientRectangle).toMatchObject(currentClientRectangle);
  });
});
