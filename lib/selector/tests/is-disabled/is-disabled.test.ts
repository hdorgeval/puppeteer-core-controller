import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - isDisabled', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should return false on wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('foo').withText('bar');
    const result = await selector.isDisabled();

    // Then
    expect(await selector.getFirstHandleOrNull()).toBe(null);
    expect(result).toBe(false);
  });

  test('should return false on element that has no value property', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .find('p')
      .withText('foobar');
    const result = await selector.isDisabled();

    // Then
    expect(await selector.getFirstHandleOrNull()).not.toBe(null);
    expect(result).toBe(false);
  });
  test('should return true when selector is disabled', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .find('select')
      .withValue('select row3');

    const result = await selector.isDisabled();

    // Then
    expect(await selector.getFirstHandleOrNull()).not.toBe(null);
    expect(result).toBe(true);
  });

  test('should return true when selector is disabled/2', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .find('select')
      .withValue('select row5');

    const result = await selector.isDisabled();

    // Then
    expect(await selector.getFirstHandleOrNull()).not.toBe(null);
    expect(result).toBe(true);
  });

  test('should return true, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .find('select')
      .withValue('select row5');

    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const result = await selector.isDisabled();

    // Then
    expect(await selector.getFirstHandleOrNull()).not.toBe(null);
    expect(result).toBe(true);
  });
});
