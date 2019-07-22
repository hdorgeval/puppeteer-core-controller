import * as puppeteer from 'puppeteer-core';
import * as SUT from './select';

describe('select', (): void => {
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;
    const optionsToSelect = ['value 1', 'value 2'];
    // When
    // Then
    const expectedError = new Error(
      "Cannot select option(s) 'value 1,value 2' in 'foobar' because a new page has not been created",
    );
    await SUT.select('foobar', optionsToSelect, SUT.defaultSelectOptions, page).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
