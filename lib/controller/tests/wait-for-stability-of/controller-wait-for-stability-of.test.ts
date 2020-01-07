import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller - waitForStabilityOf', (): void => {
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

  test('should wait until selectors count is stable', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-for-stability-of.test.html')}`;

    const selector = pptc.selector('[role="row"]');

    // When
    await pptc.initWith(launchOptions).navigateTo(url);
    const initialCountStatus = await selector.count();
    await pptc.waitForStabilityOf(() => selector.count(), { stabilityInMilliseconds: 1000 });
    const finalCountStatus = await selector.count();

    // Then
    expect(initialCountStatus).toBe(3);
    expect(finalCountStatus).toBe(6);
  });

  test('should throw default error on timeout', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-for-stability-of.test.html')}`;

    const selector = pptc.selector('[role="row"]');

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .waitForStabilityOf(() => selector.count(), {
          stabilityInMilliseconds: 1000,
          timeoutInMilliseconds: 300,
          throwOnTimeout: true,
        });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      'The value function cannot converge to a stable result after 300 ms.';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test.skip('should throw custom error on timeout', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-for-stability-of.test.html')}`;

    const selector = pptc.selector('[role="row"]');

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

  test.skip('should throw custom function error on timeout', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait-for-stability-of.test.html')}`;

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
