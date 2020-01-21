import * as SUT from '../../controller';
import { LaunchOptions, launchBrowser } from '../../../actions';
import { getChromePath } from '../../../utils';

describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (pptc) {
        await pptc.close();
      }
    },
  );
  test('should get undefined instances from controller', async (): Promise<void> => {
    // Given
    pptc = new SUT.PuppeteerController();

    // When
    const [browser, page] = pptc.getInstances();

    // Then
    expect(browser).toBe(undefined);
    expect(page).toBe(undefined);
  });

  test('should get browser and page instances from controller', async (): Promise<void> => {
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

    const [browser2, page2] = pptc.getInstances();

    // Then
    expect(browser).toBe(browser2);
    expect(page).toBe(page2);
  });
});
