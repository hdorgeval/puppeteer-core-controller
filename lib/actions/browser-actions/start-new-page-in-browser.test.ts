import * as puppeteer from 'puppeteer-core';
import * as SUT from './start-new-page-in-browser';

describe('start-new-page-in-browser', (): void => {
  test('should return an error when browser has not been initalized', async (): Promise<void> => {
    // Given
    const browser: puppeteer.Browser | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      'Error: cannot create a new page because the browser has not been launched',
    );
    await SUT.startNewPageInBrowser(browser).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
