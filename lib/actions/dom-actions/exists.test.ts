import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';

describe('exists', (): void => {
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Error: cannot check that 'foobar' exists because a new page has not been created",
    );
    await SUT.exists('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
