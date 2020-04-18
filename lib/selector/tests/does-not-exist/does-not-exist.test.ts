import * as SUT from '../../../controller';
import { LaunchOptions } from '../../../controller';
import * as path from 'path';

describe('Puppeteer Controller - Selector API - doesNotExist', (): void => {
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

  test('should return true on wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('foo').withText('bar');
    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(true);
  });

  test('should return false when selector is visible', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector is hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am hidden');

    const result = await selector.doesNotExist();
    const isVisible = await selector.isVisible();

    // Then
    expect(result).toBe(false);
    expect(isVisible).toBe(false);
  });
  test('should return false when selector is transparent', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector is out of screen', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am out of screen');

    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });
  test('should return false when selector is first hidden', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    const initialExistsStatus = await selector.doesNotExist();
    await pptc.wait(5000);
    const finalExistsStatus = await selector.doesNotExist();

    // Then
    expect(initialExistsStatus).toBe(false);
    expect(finalExistsStatus).toBe(false);
  });

  test('should wait for selector to be removed from DOM', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const selector = pptc.selector('p').withText('visible then removed');

    const initialExistsStatus = await selector.doesNotExist();
    await pptc.waitUntil(() => selector.doesNotExist(), { verbose: true });
    const finalExistsStatus = await selector.doesNotExist();

    // Then
    expect(initialExistsStatus).toBe(false);
    expect(finalExistsStatus).toBe(true);
  });

  test('should return false, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    // prettier-ignore
    const selector = pptc
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const url = `file:${path.join(__dirname, 'does-not-exist.test.html')}`;
    await pptc.initWith(launchOptions).navigateTo(url);

    // When
    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });
});
