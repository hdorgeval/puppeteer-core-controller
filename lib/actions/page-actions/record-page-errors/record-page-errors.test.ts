import * as puppeteer from 'puppeteer-core';
import * as SUT from './record-page-errors';
import * as path from 'path';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';

describe('record page errors', (): void => {
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
    const errors: Error[] = [];

    // When
    // Then
    const expectedError = new Error(
      'Error: cannot record page errors because a new page has not been created',
    );
    await SUT.recordPageErrors(page, (err) => errors.push(err)).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
  test('should record page errors', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const errors: Error[] = [];

    // When
    await SUT.recordPageErrors(page, (err) => errors.push(err));
    await page.goto(`file:${path.join(__dirname, 'record-page-errors.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain('Oops');
  });
});
