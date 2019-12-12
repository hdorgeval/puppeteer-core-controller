import * as SUT from '../controller';
import { LaunchOptions } from '../../actions';
import * as path from 'path';

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

  test('should wait', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-wait.test.html')}`;

    // When
    await pptc.initWith(launchOptions).navigateTo(url);
    const startTime = new Date().getTime();
    await pptc.wait(1000);
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    expect(duration).toBeGreaterThan(900);
    expect(duration).toBeLessThan(1100);
  });
});
