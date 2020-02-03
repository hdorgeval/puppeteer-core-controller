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
  test('should give back an error on incorrect browser path', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
      executablePath: 'yo.app',
    };

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.initWith(launchOptions);
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain('Failed to launch chrome');
    expect(result && result.message).toContain('yo.app');
  });

  test('should give back an error on navigating to an url without doing an init', async (): Promise<
    void
  > => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pptc.navigateTo('https://www.google.fr');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Error: cannot navigate to 'https://www.google.fr' because a new page has not been created",
    );
  });

  test('should initialize', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };

    // When
    await pptc.initWith(launchOptions);

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
  });
});
