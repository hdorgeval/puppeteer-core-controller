import * as SUT from '../controller';
import { LaunchOptions } from '../../actions';

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
      "Error: cannot select 'foobar' in list 'select#exampleCustomSelect'";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
