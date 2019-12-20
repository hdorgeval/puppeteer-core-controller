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
    const url = 'https://reactstrap.github.io/components/form';
    const customSelect = 'select#exampleCustomSelect';
    const option = 'Value 3';

    // When
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(customSelect)
      .select(option)
      .in(customSelect);

    // Then
    const selectedOption = await pptc.getSelectedOptionOf(customSelect);
    expect(selectedOption).toBe(option);
    expect(pptc.lastError).toBe(undefined);
  });

  test('should throw an error when selecting an unknown option', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const customSelect = 'select#exampleCustomSelect';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .click(customSelect)
        .select('foobar')
        .in(customSelect);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot select 'foobar' in list 'select#exampleCustomSelect' because it does not match available options: 'Select,Value 1,Value 2,Value 3,Value 4,Value 5'";
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should throw an error when selecting an option with a space in it', async (): Promise<
    void
  > => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-select.test.html')}`;
    const selector = 'select#select1';

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc
        .initWith(launchOptions)
        .navigateTo(url)
        .select('value 2')
        .in(selector);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot select 'value 2' in list 'select#select1' because it does not match available options: 'value1,value2,value3'";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
