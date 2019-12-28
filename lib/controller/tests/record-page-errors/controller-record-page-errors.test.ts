import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
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

  test('should record page errors', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-record-page-errors.test.html')}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordPageErrors()
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getPageErrors();

    expect(result.length).toBe(3);
    expect(result[0].message).toContain('Error#1');
    expect(result[1].message).toContain('Error#2');
    expect(result[2].message).toContain('Error#3');
  });

  test('should record page errors - after init', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-record-page-errors.test.html')}`;

    // When
    await pptc.initWith(launchOptions);

    await pptc
      .recordPageErrors()
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getPageErrors();

    expect(result.length).toBe(3);
    expect(result[0].message).toContain('Error#1');
    expect(result[1].message).toContain('Error#2');
    expect(result[2].message).toContain('Error#3');
  });

  test('should clear page errors', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-record-page-errors.test.html')}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordPageErrors()
      .navigateTo(url)
      .wait(2000);

    pptc.clearPageErrors();
    await pptc.navigateTo(url).wait(2000);

    // Then
    const result = pptc.getPageErrors();
    expect(result.length).toBe(3);
    expect(result[0].message).toContain('Error#1');
    expect(result[1].message).toContain('Error#2');
    expect(result[2].message).toContain('Error#3');
  });

  test('should accumulate page errors', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const url = `file:${path.join(__dirname, 'controller-record-page-errors.test.html')}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordPageErrors()
      .navigateTo(url)
      .wait(2000);

    await pptc.navigateTo(url).wait(2000);

    // Then
    const result = pptc.getPageErrors();
    expect(result.length).toBe(6);
    expect(result[0].message).toContain('Error#1');
    expect(result[1].message).toContain('Error#2');
    expect(result[2].message).toContain('Error#3');
    expect(result[3].message).toContain('Error#1');
    expect(result[4].message).toContain('Error#2');
    expect(result[5].message).toContain('Error#3');
  });
});
