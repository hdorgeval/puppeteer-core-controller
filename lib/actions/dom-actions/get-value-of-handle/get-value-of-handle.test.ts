import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';

describe('get value of handle', (): void => {
  test('should return null when selector is null', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = null;

    // When
    const result = await SUT.getValueOfHandle(selector);

    // Then
    expect(result).toBe(null);
  });

  test('should return null when selector is undefined', async (): Promise<void> => {
    // Given
    const selector: puppeteer.ElementHandle<Element> | null | undefined = undefined;

    // When
    const result = await SUT.getValueOfHandle(selector);

    // Then
    expect(result).toBe(null);
  });
});
