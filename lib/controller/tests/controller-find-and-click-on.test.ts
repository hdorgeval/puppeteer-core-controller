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

  test('should find a button with text and click on it ', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io';

    // When
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url)
      .find('a.btn')
      .withText('Compo')
      .click();

    // Then
    const currentUrl = await pptc.getCurrentUrl();
    expect(currentUrl).toBe('https://reactstrap.github.io/components/alerts/');
  });

  test('should find a button with exact text and click on it ', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io';

    // When
    await pptc
      .initWith(launchOptions)
      .withCursor()
      .navigateTo(url)
      .find('a.btn')
      .withExactText('Components')
      .click();

    // Then
    const currentUrl = await pptc.getCurrentUrl();
    expect(currentUrl).toBe('https://reactstrap.github.io/components/alerts/');
  });
});
