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

  test('should emulate iphone', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const emailInputSelector = 'input#exampleEmail';

    // When
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .emulateDevice('iPhone 5 landscape')
      .navigateTo(url)
      .click(emailInputSelector)
      .expectThat(emailInputSelector)
      .hasFocus({ timeoutInMilliseconds: 5000 })
      .typeText('foo.bar@baz.com');

    // Then
    const emailInputClientRectangle = await pptc.getClientRectangleOf(emailInputSelector);
    const cursorClientRectangle = await pptc.getClientRectangleOf('puppeteer-mouse-pointer');

    const emailInputMiddleX = emailInputClientRectangle.left + emailInputClientRectangle.width / 2;
    const emailInputMiddleY = emailInputClientRectangle.top + emailInputClientRectangle.height / 2;

    const cursorMiddleX = cursorClientRectangle.left + cursorClientRectangle.width / 2;
    const cursorMiddleY = cursorClientRectangle.top + cursorClientRectangle.height / 2;

    expect(Math.abs(emailInputMiddleX - cursorMiddleX)).toBeLessThanOrEqual(1);
    expect(Math.abs(emailInputMiddleY - cursorMiddleY)).toBeLessThanOrEqual(1);
    expect(pptc.lastError).toBe(undefined);
  });
});
