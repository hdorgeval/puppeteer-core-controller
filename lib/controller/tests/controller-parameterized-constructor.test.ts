import * as SUT from '../controller';
import { LaunchOptions, launchBrowser } from '../../actions';
import { getChromePath } from '../../utils';

describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should use existing browser and page instance', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
      executablePath: getChromePath(),
    };
    const url = 'https://reactstrap.github.io/components/form';
    const emailInputSelector = 'input#exampleEmail';
    const browser = await launchBrowser(launchOptions);
    const page = await browser.newPage();

    pptc = new SUT.PuppeteerController(browser, page);

    // When
    await pptc
      .navigateTo(url)
      .click(emailInputSelector)
      .expectThat(emailInputSelector)
      .hasFocus({ timeoutInMilliseconds: 5000 })
      .typeText('foo.bar@baz.com');

    // Then
    const result = await pptc.getValueOf(emailInputSelector);
    expect(result).toBe('foo.bar@baz.com');
    expect(pptc.lastError).toBe(undefined);
  });
});
