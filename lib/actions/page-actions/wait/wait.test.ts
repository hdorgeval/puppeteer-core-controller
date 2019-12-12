import * as puppeteer from 'puppeteer-core';
import * as SUT from '.';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';

describe('wait', (): void => {
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
    const expectedError = new Error('Error: cannot wait because a new page has not been created');
    await SUT.wait(1000, page).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should wait the expected duration', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();

    // When
    const startTime = new Date().getTime();
    await SUT.wait(1000, page);
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(duration).toBeGreaterThan(900);
    expect(duration).toBeLessThan(1100);
  });
});
