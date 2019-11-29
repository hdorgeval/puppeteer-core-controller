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

  test('should hover to an existing checkbox', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const checkMeOutSelector = 'input[type="checkbox"].form-check-input';
    const emailInputSelector = 'input#exampleEmail';
    const passwordInputSelector = 'input#examplePassword';
    const customSelect = 'select#exampleSelect';
    const option = '3';

    // When
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url)
      .hover(emailInputSelector, { steps: 100 })
      .click(emailInputSelector)
      .typeText('foo@bar.com')
      .hover(passwordInputSelector)
      .click(passwordInputSelector)
      .typeText('dont tell!')
      .hover(customSelect)
      .click(customSelect)
      .select(option)
      .in(customSelect)
      .hover(checkMeOutSelector)
      .click(checkMeOutSelector);

    // Then
    const isChecked = await pptc.isChecked(checkMeOutSelector);
    expect(isChecked).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });
});
