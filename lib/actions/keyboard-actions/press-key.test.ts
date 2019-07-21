import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';

describe('press key', (): void => {
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot press key 'Tab' because a new page has not been created",
    );
    await SUT.pressKey('Tab', SUT.defaultKeyboardPressOptions, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
