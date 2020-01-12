import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import * as path from 'path';
import { getAllOptionsOf, getSelectedOptionOf } from '../../dom-actions';

describe('select', (): void => {
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
    const optionsToSelect = ['value 1', 'value 2'];
    // When
    // Then
    const expectedError = new Error(
      "Error: cannot select option(s) 'value 1,value 2' in 'foobar' because a new page has not been created",
    );
    await SUT.select(
      'foobar',
      optionsToSelect,
      SUT.defaultSelectOptions,
      page,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should return an error when selector is not found', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const optionsToSelect = ['value 1', 'value 2'];

    // When
    // Then
    const expectedError = new Error(
      'waiting for selector "foobar" failed: timeout 5000ms exceeded',
    );
    await SUT.select(
      'foobar',
      optionsToSelect,
      { timeoutInMilliseconds: 5000 },
      page,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should wait for option to be available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'select.test.html')}`);
    const optionsToSelect = ['label foo', 'label bar'];
    const selector = '#enabledSelect';
    // When
    const previousOptions = await getAllOptionsOf(selector, page);
    await SUT.select(selector, optionsToSelect, SUT.defaultSelectOptions, page);
    const currentOptions = await getAllOptionsOf(selector, page);
    const selectedOption = await getSelectedOptionOf(selector, page);

    // Then
    expect(previousOptions.length).toBe(3);
    expect(currentOptions.length).toBe(5);
    expect(selectedOption?.label).toBe('label foo');
  });

  test('should wait for options to be available', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    await page.goto(`file:${path.join(__dirname, 'select.test.html')}`);
    const optionsToSelect = ['label foo', 'label bar'];
    const selector = '#multiSelect';
    // When
    const previousOptions = await getAllOptionsOf(selector, page);
    await SUT.select(selector, optionsToSelect, SUT.defaultSelectOptions, page);
    const currentOptions = await getAllOptionsOf(selector, page);
    const selectedOption = await getSelectedOptionOf(selector, page);

    // Then
    expect(previousOptions.length).toBe(2);
    expect(currentOptions.length).toBe(4);
    expect(selectedOption?.label).toBe('label foo');
  });
});
