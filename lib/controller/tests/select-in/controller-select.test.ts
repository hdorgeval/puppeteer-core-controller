import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should select an existing option', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-select.test.html')}`;
    const selector = '#select2';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .select('value 3')
      .in(selector);

    // Then
    const selectedOption = await pptc.getSelectedOptionOf(selector);
    expect(selectedOption?.label).toBe('value 3');
    expect(pptc.lastError).toBe(undefined);
  });

  test('should throw an error when selecting an unknown option', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-select.test.html')}`;
    const selector = '#select1';

    // When
    const startTime = new Date().getTime();
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .select('foobar')
        .in(selector, { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    // eslint-disable-next-line no-console
    console.log(`test duration: ${duration} ms`);
    const expectedErrorMessage = "option(s) [foobar] is still missing in '#select1' after 5000 ms";
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should throw an error when selecting an option by its value instead of its label', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-select.test.html')}`;
    const selector = '#select2';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .select('value3')
        .in(selector, { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Error: option(s) [value3] is still missing in '#select2' after 5000 ms";
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should not modify the selected option when trying to select an unknown option', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-select.test.html')}`;
    const selector = '#select2';

    // When
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .select('foobar')
        .in(selector, { timeoutInMilliseconds: 5000 });
    } catch (error) {
      // empty catch for testing purposes
    }

    // Then
    const allOptions = await pptc.getAllOptionsOf(selector);
    const selectedOption = await pptc.getSelectedOptionOf(selector);

    expect(Array.isArray(allOptions)).toBe(true);
    expect(allOptions.length).toBe(3);
    expect(selectedOption?.label).toBe('value 2');
    expect(selectedOption?.value).toBe('value2');
    expect(selectedOption?.selected).toBe(true);
    expect(allOptions.find((o) => o.selected)?.label).toBe('value 2');
  });
});
