import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';

describe('Puppeteer Controller', (): void => {
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

  test('should select an existing option', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-select.test.html')}`;
    const selector = '#select2';

    // When
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
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .select('foobar')
        .in(selector);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot select 'foobar' in list '#select1' because it does not match available options: 'value1,value2,value3'";
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
        .in(selector);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot select 'value3' in list '#select2' because it does not match available options: 'value 1,value 2,value 3'";
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
        .in(selector);
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
