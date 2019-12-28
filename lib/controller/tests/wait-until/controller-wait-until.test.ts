import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller - waitUntil', (): void => {
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

  test('should wait until selector is visible', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-until.test.html')}`;

    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    // When
    await pptc.initWith(launchOptions).navigateTo(url);

    const initialVisibleStatus = await selector.isVisible();

    await pptc.waitUntil(() => selector.isVisible());

    const finalVisibleStatus = await selector.isVisible();

    // Then
    expect(initialVisibleStatus).toBe(false);
    expect(finalVisibleStatus).toBe(true);
  });

  test('should throw default error on timeout', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-until.test.html')}`;

    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .waitUntil(() => selector.isVisible(), {
          timeoutInMilliseconds: 300,
          throwOnTimeout: true,
        });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'predicate still resolved to false after 300 ms.';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw custom error on timeout', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-until.test.html')}`;

    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    // When
    let result: Error | undefined = undefined;
    const errorMessage = `The following selector is not visible: ${selector.toString()}`;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .waitUntil(
          () => selector.isVisible(),
          {
            timeoutInMilliseconds: 300,
            throwOnTimeout: true,
          },
          errorMessage,
        );
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'The following selector is not visible:';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toContain(expectedErrorMessage);
  });

  test('should throw custom function error on timeout', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-until.test.html')}`;

    const selector = pptc
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    // When
    let result: Error | undefined = undefined;
    const errorMessage = `The following selector is not visible: ${selector.toString()}`;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .waitUntil(
          () => selector.isVisible(),
          {
            timeoutInMilliseconds: 300,
            throwOnTimeout: true,
          },
          () => Promise.resolve(errorMessage),
        );
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'The following selector is not visible:';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toContain(expectedErrorMessage);
  });
});
