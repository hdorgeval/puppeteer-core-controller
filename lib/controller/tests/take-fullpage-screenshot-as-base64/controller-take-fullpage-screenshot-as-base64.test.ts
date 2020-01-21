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

  test('should take a screenshot of the full page', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = 'https://reactstrap.github.io/';

    // When
    await pptc.initWith(launchOptions).navigateTo(url);
    const result = await pptc.takeFullPageScreenshotAsBase64();

    // Then
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(300000);
  });
});
