import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';

describe('get value', (): void => {
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Error: cannot get the value of 'foobar' because a new page has not been created",
    );
    await SUT.getValueOf('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
