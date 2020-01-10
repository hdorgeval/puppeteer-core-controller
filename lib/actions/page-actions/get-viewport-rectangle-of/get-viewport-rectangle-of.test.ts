import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import { ViewportRect } from './index';

describe('get viewport rectangle of page', (): void => {
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
      'Error: cannot get the viewport because a new page has not been created',
    );
    await SUT.getViewportRectangleOf(page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return defaultViewport', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const result = await SUT.getViewportRectangleOf(page);

    // Then
    const defaultViewportRectangle: ViewportRect = {
      height: 600,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      width: 800,
    };
    expect(result).toBeDefined();
    expect(result).toMatchObject(defaultViewportRectangle);
  });
});
