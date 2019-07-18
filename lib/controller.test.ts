import * as SUT from './controller';
import { LaunchOptions } from './actions';
describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  beforeEach((): void => {
    jest.setTimeout(10000);
    pptc = new SUT.PuppeteerController();
  });
  test('should give back an error on incorrect browser path', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
      executablePath: 'yo.app',
    };

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .close();

    // Then
    const result = pptc.lastError;
    expect(result && result.message).toContain('Failed to launch chrome');
  });

  test('should give back an error on navigating to an url without doing an init', async (): Promise<
    void
  > => {
    // Given

    // When
    // prettier-ignore
    await pptc
      .navigateTo('https://www.google.fr')
      .close();

    // Then
    const result = pptc.lastError;
    expect(result && result.message).toContain(
      "Cannot navigate to 'https://www.google.fr' because a new page has not been created",
    );
  });

  test('should initialize', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .close();

    // Then
    expect(pptc.lastError).toBe(undefined);
  });

  test('should navigate to url', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .navigateTo(url);

    // Then
    expect(await pptc.getCurrentUrl()).toBe(`${url}/`);
    expect(pptc.lastError).toBe(undefined);
    await pptc.close();
  });

  test('should start with max sized window', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .withMaxSizeWindow()
      .navigateTo(url);

    const result = await pptc.getCurrentBrowserWindowState();

    // Then
    expect(result.isMaximized).toBe(true);
    expect(pptc.lastError).toBe(undefined);
    await pptc.close();
  });
});
