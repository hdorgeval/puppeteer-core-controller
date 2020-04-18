import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';

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

  test('should get computed styles for valid input', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const validInput = 'input[type="text"].is-valid.form-control';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(validInput);

    // Then
    const computedStyles = await pptc.getComputedStyleOf(validInput);
    expect(computedStyles.borderColor).toBe('rgb(40, 167, 69)');
    expect(pptc.lastError).toBe(undefined);
  });

  test('should get computed styles for invalid input', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const invalidInput = 'input[type="text"].is-invalid.form-control';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url)
      .click(invalidInput);

    // Then
    const computedStyles = await pptc.getComputedStyleOf(invalidInput);
    expect(computedStyles.borderColor).toBe('rgb(220, 53, 69)');
    expect(pptc.lastError).toBe(undefined);
  });
});
