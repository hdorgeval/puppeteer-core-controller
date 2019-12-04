import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../browser-actions';
import { getChromePath } from '../../utils';
import { zeroClientRectangle } from './has-moved';
import * as path from 'path';

describe('selector has moved', (): void => {
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
      "Error: cannot check that 'foobar' has moved because a new page has not been created",
    );
    await SUT.hasMoved('foobar', zeroClientRectangle, page).catch((error): void =>
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
    await SUT.hasMoved('foobar', zeroClientRectangle, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should detect that selector has moved', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-moved.test1.html')}`);
    const previousClientRectangle = await SUT.getClientRectangleOf('#moving', page);
    await page.waitFor(500);

    // When
    const hasMoved = await SUT.hasMoved('#moving', previousClientRectangle, page);

    // Then
    expect(hasMoved).toBe(true);
  });

  test('should detect that selector does not move', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'has-moved.test2.html')}`);
    await page.waitFor(2000); // wait twice the animation duration
    const previousClientRectangle = await SUT.getClientRectangleOf('#moving', page);

    // When
    const hasMoved = await SUT.hasMoved('#moving', previousClientRectangle, page);

    // Then
    expect(hasMoved).toBe(false);
  });
});
