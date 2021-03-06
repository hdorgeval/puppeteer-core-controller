import * as puppeteer from 'puppeteer-core';
import * as SUT from '..';
import { getChromePath } from '../../../utils';
import { launchBrowser } from '../../browser-actions';

describe('fullpage screenshot as base64', (): void => {
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
      'Error: cannot take a screenshot of the full page because page has not been created',
    );
    await SUT.takeFullPageScreenshotAsBase64(
      SUT.mandatoryFullPageScreenshotOptions,
      page,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should take a screenshot of the page', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const result = await SUT.takeFullPageScreenshotAsBase64(
      SUT.mandatoryFullPageScreenshotOptions,
      page,
    );

    // Then
    const expectedScreenshot =
      'iVBORw0KGgoAAAANSUhEUgAAAyAAAAJYCAYAAACadoJwAAAAAXNSR0IArs4c6QAADGtJREFUeJzt1zEBACAMwDDAv+fhohwkCvp2z8wsAACAwHkdAAAA/MOAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkLulXCKxmRrE1AAAAAElFTkSuQmCC';
    expect(result).toBe(expectedScreenshot);
  });

  test('should take a screenshot of the page evan when options are not set correctly setup', async (): Promise<
    void
  > => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const result = await SUT.takeFullPageScreenshotAsBase64(
      { encoding: 'binary', fullPage: false },
      page,
    );

    // Then
    const expectedScreenshot =
      'iVBORw0KGgoAAAANSUhEUgAAAyAAAAJYCAYAAACadoJwAAAAAXNSR0IArs4c6QAADGtJREFUeJzt1zEBACAMwDDAv+fhohwkCvp2z8wsAACAwHkdAAAA/MOAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkDAgAAJAxIAAAQMaAAAAAGQMCAABkLulXCKxmRrE1AAAAAElFTkSuQmCC';
    expect(result).toBe(expectedScreenshot);
  });

  test('should take a screenshot of the full page', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const url = 'https://reactstrap.github.io';
    await page.goto(url);

    // When
    const result = await SUT.takeFullPageScreenshotAsBase64(
      SUT.mandatoryFullPageScreenshotOptions,
      page,
    );

    // Then
    expect(result.length).toBeGreaterThan(300000);
  });
});
