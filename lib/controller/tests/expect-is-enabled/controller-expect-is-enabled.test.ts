import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller - assertion API - isEnabled', (): void => {
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

  test('should throw an error on asserting wrong selector', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const foobarSelector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(foobarSelector)
        .isEnabled({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: failed to find element matching selector "foobar"';
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when selector is disabled', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const inputSelector = 'input#exampleCustomCheckbox3';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(inputSelector)
        .isEnabled({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = "Error: Selector 'input#exampleCustomCheckbox3' is disabled.";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect(pptc.lastError && pptc.lastError.message).toBe(expectedErrorMessage);
  });

  test('should throw an error when page is not created', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat('foobar').isEnabled({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = 'Error: expect statement only works when a page has been opened.';
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should expect is enabled', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const inputSelector = 'input#exampleCustomCheckbox2';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .expectThat(inputSelector)
        .isEnabled({ timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBeUndefined();
  });

  test('should wait for the selector to be enabled', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const url = `file:${path.join(__dirname, 'controller-expect-is-enabled.test.html')}`;
    const inputSelector = 'input#disabledInput';

    await pptc.initWith(launchOptions).navigateTo(url);
    const wasInitiallyDisabled = await pptc.isDisabled(inputSelector);

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat(inputSelector).isEnabled();
    } catch (error) {
      result = error;
    }

    const wasFinallyDisabled = await pptc.isDisabled(inputSelector);

    // Then
    expect(wasInitiallyDisabled).toBe(true);
    expect(wasFinallyDisabled).toBe(false);
    expect(result).toBeUndefined();
  });

  test('should timeout for the selector to be enabled', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    const url = `file:${path.join(__dirname, 'controller-expect-is-enabled.test.html')}`;
    const inputSelector = 'input#disabledInput';

    await pptc.initWith(launchOptions).navigateTo(url);
    const wasInitiallyDisabled = await pptc.isDisabled(inputSelector);

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.expectThat(inputSelector).isEnabled({ timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(wasInitiallyDisabled).toBe(true);
    const expectedErrorMessage = "Error: Selector 'input#disabledInput' is disabled.";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
