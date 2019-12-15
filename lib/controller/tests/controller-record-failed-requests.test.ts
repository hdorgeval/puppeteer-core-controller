import * as SUT from '../controller';
import { LaunchOptions } from '../../actions';
import * as path from 'path';
import { FakeServer } from 'simple-fake-server';

describe('Puppeteer Controller', (): void => {
  let pptc: SUT.PuppeteerController;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1234);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1234
  });
  afterAll(() => {
    if (fakeServer) {
      fakeServer.stop();
    }
  });
  beforeEach((): void => {
    jest.setTimeout(30000);
    pptc = new SUT.PuppeteerController();
  });
  afterEach(
    async (): Promise<void> => {
      await pptc.close();
    },
  );

  test('should record failed requests HTTP 500 - after init', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    fakeServer &&
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    const url = `file:${path.join(__dirname, 'controller-record-failed-requests-500.test.html')}`;

    // When
    await pptc.initWith(launchOptions);

    await pptc
      .recordFailedRequests()
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getFailedRequests();

    expect(result.length).toBe(1);
    expect(result[0].response()?.status()).toBe(500);
    expect(result[0].response()?.statusText()).toBe('Internal Server Error');
  });

  test('should record failed requests HTTP 500', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    fakeServer &&
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    const url = `file:${path.join(__dirname, 'controller-record-failed-requests-500.test.html')}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordFailedRequests()
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getFailedRequests();

    expect(result.length).toBe(1);
    expect(result[0].response()?.status()).toBe(500);
    expect(result[0].response()?.statusText()).toBe('Internal Server Error');
  });

  test('should clear failed requests', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    fakeServer &&
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    const url = `file:${path.join(__dirname, 'controller-record-failed-requests-500.test.html')}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordFailedRequests()
      .navigateTo(url)
      .wait(2000);

    pptc.clearFailedRequests();
    await pptc.navigateTo(url).wait(2000);

    // Then
    const result = pptc.getFailedRequests();
    expect(result.length).toBe(1);
    expect(result[0].response()?.status()).toBe(500);
    expect(result[0].response()?.statusText()).toBe('Internal Server Error');
  });

  test('should accumulate failed requests', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    fakeServer &&
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);
    fakeServer &&
      fakeServer.http
        .get()
        .to('/503')
        .willFail(503);
    fakeServer &&
      fakeServer.http
        .get()
        .to('/400')
        .willFail(400);

    const url500 = `file:${path.join(
      __dirname,
      'controller-record-failed-requests-500.test.html',
    )}`;
    const url503 = `file:${path.join(
      __dirname,
      'controller-record-failed-requests-503.test.html',
    )}`;
    const url400 = `file:${path.join(
      __dirname,
      'controller-record-failed-requests-400.test.html',
    )}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordFailedRequests()
      .navigateTo(url500)
      .wait(2000)
      .navigateTo(url503)
      .wait(2000)
      .navigateTo(url400)
      .wait(2000);

    // Then
    const result = pptc.getFailedRequests();
    expect(result.length).toBe(3);
    expect(result[0].response()?.status()).toBe(500);
    expect(result[0].response()?.statusText()).toBe('Internal Server Error');
    expect(result[1].response()?.status()).toBe(503);
    expect(result[1].response()?.statusText()).toBe('Service Unavailable');
    expect(result[2].response()?.status()).toBe(400);
    expect(result[2].response()?.statusText()).toBe('Bad Request');
  });
});
