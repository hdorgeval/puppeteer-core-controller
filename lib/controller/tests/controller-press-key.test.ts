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

  test('should press key Tab', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const emailInputSelector = 'input#exampleEmail';
    const passwordInputSelector = 'input#examplePassword';

    // When
    await pptc
      .initWith(launchOptions)
      .withMaxSizeWindow()
      .navigateTo(url)
      .click(emailInputSelector)
      .typeText('foo.bar@baz.com')
      .pressKey('Tab')
      .expectThat(passwordInputSelector)
      .hasFocus({ timeoutInMilliseconds: 5000 });

    // Then
    const emaildHasFocus = await pptc.hasFocus(emailInputSelector);
    expect(emaildHasFocus).toBe(false);

    const passwordHasFocus = await pptc.hasFocus(passwordInputSelector);
    expect(passwordHasFocus).toBe(true);
    expect(pptc.lastError).toBe(undefined);
  });
});
