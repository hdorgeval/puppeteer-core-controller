import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';

describe('type text', (): void => {
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      'Error: cannot type text because a new page has not been created',
    );
    await SUT.typeText('foobar', SUT.defaultTypeTextOptions, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
