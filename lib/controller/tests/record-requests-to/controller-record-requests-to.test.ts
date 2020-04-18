import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
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
    // prettier-ignore
    fakeServer && 
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    const url = `file:${path.join(__dirname, 'controller-record-failed-requests-500.test.html')}`;

    // When
    await pptc.initWith(launchOptions);

    // prettier-ignore
    await pptc
      .recordFailedRequests()
      .recordRequestsTo('/500')
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getFailedRequests();
    const result2 = pptc.getRequestsTo('/500');

    expect(result.length).toBe(1);
    expect(result[0].response()?.status()).toBe(500);
    expect(result[0].response()?.statusText()).toBe('Internal Server Error');
    expect(result2.length).toBe(1);
    expect(result2[0].response()?.status()).toBe(500);
    expect(result2[0].response()?.statusText()).toBe('Internal Server Error');
  });

  test('should record failed requests HTTP 500', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    // prettier-ignore
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
      .recordRequestsTo('/500')
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getFailedRequests();
    const result2 = pptc.getRequestsTo('/500');

    expect(result.length).toBe(1);
    expect(result[0].response()?.status()).toBe(500);
    expect(result[0].response()?.statusText()).toBe('Internal Server Error');
    expect(result2.length).toBe(1);
    expect(result2[0].response()?.status()).toBe(500);
    expect(result2[0].response()?.statusText()).toBe('Internal Server Error');
  });

  test('should clear requests', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    // prettier-ignore
    fakeServer && 
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    const url = `file:${path.join(__dirname, 'controller-record-failed-requests-500.test.html')}`;

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .recordRequestsTo('/500')
      .navigateTo(url)
      .wait(2000);

    pptc.clearRequestsTo('/500');
    await pptc.navigateTo(url).wait(2000);

    // Then
    const result = pptc.getRequestsTo('/500');
    expect(result.length).toBe(1);
    expect(result[0].response()?.status()).toBe(500);
    expect(result[0].response()?.statusText()).toBe('Internal Server Error');
  });

  test('should record requests to specific url', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    // prettier-ignore
    fakeServer &&
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    // prettier-ignore
    fakeServer && 
      fakeServer.http
        .get()
        .to('/yo')
        .willReturn(responseBody, 200, responseHeaders);

    const url = `file:${path.join(__dirname, 'controller-record-requests-to.test.html')}`;

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .recordRequestsTo('/foobar')
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getRequestsTo('/foobar');

    expect(result.length).toBe(1);
    expect(result[0].url()).toContain('?foo=bar');
    expect(result[0].response()?.status()).toBe(200);
    expect(await result[0].response()?.json()).toMatchObject(responseBody);
  });

  test('should record requests to different urls', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };

    const responseBody2 = {
      prop2: 'foobar',
    };
    const responseHeaders2 = {
      'foo-header2': 'bar',
    };
    // prettier-ignore
    fakeServer &&
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    // prettier-ignore
    fakeServer && 
      fakeServer.http
        .get()
        .to('/yo')
        .willReturn(responseBody2, 200, responseHeaders2);

    const url = `file:${path.join(__dirname, 'controller-record-requests-to.test.html')}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordRequestsTo('/foobar')
      .recordRequestsTo('/yo')
      .navigateTo(url)
      .wait(2000);

    // Then
    const result = pptc.getRequestsTo('/foobar');

    expect(result.length).toBe(1);
    expect(result[0].url()).toContain('?foo=bar');
    expect(result[0].response()?.status()).toBe(200);
    expect(await result[0].response()?.json()).toMatchObject(responseBody);

    // Then
    const result2 = pptc.getRequestsTo('/yo');

    expect(result2.length).toBe(1);
    expect(result2[0].url()).toContain('?foo=bar');
    expect(result2[0].response()?.status()).toBe(200);
    expect(await result2[0].response()?.json()).toMatchObject(responseBody2);

    // When
    pptc.clearRequestsTo('/yo');
    // Then
    expect(pptc.getRequestsTo('/yo').length).toBe(0);
    expect(pptc.getRequestsTo('/foobar').length).toBe(1);

    // When
    pptc.clearRequestsTo('/foobar');
    // Then
    expect(pptc.getRequestsTo('/foobar').length).toBe(0);
  });

  test('should aggregate requests to specific url', async (): Promise<void> => {
    // Given
    const launchOptions: LaunchOptions = {
      headless: true,
    };
    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    // prettier-ignore
    fakeServer &&
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    // prettier-ignore
    fakeServer && 
      fakeServer.http
        .get()
        .to('/yo')
        .willReturn(responseBody, 200, responseHeaders);

    const url = `file:${path.join(__dirname, 'controller-record-requests-to.test.html')}`;
    const url2 = `file:${path.join(__dirname, 'controller-record-requests-to.test2.html')}`;
    const url3 = `file:${path.join(__dirname, 'controller-record-requests-to.test3.html')}`;

    // When
    await pptc
      .initWith(launchOptions)
      .recordRequestsTo('/foobar')
      .navigateTo(url)
      .wait(2000)
      .navigateTo(url2)
      .wait(2000)
      .navigateTo(url3)
      .wait(2000);

    // Then
    const result = pptc.getRequestsTo('/foobar');
    const lastRequest = pptc.getLastRequestTo('/foobar');
    expect(result.length).toBe(3);
    expect(lastRequest).toBeDefined();
    expect(lastRequest?.url()).toContain('?foo=bar3');
  });
});
