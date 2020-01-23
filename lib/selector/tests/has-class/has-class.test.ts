import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - hasClass', (): void => {
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
    const url = `file:${path.join(__dirname, 'has-class.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('foo').withText('bar');
    const result = await selector.hasClass('foobar');

    // Then
    expect(await selector.getFirstHandleOrNull()).toBe(null);
    expect(result).toBe(false);
  });

  test('should return false on element that has no class attribute', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'has-class.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('p').withText('with no class');
    const result = await selector.hasClass('foobar');

    // Then
    expect(await selector.getFirstHandleOrNull()).not.toBe(null);
    expect(result).toBe(false);
  });
  test('should return true when selector has the class', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'has-class.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('p').withText('with two classes');

    const result1 = await selector.hasClass('foo');
    const result2 = await selector.hasClass('bar');
    const result3 = await selector.hasClass('foo bar');

    // Then
    expect(await selector.getFirstHandleOrNull()).not.toBe(null);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(false);
  });

  test('should return true, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const selector = pptc.selector('p').withText('with two classes');
    const url = `file:${path.join(__dirname, 'has-class.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const result1 = await selector.hasClass('foo');
    const result2 = await selector.hasClass('bar');
    const result3 = await selector.hasClass('foo bar');

    // Then
    expect(await selector.getFirstHandleOrNull()).not.toBe(null);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(false);
  });
});
