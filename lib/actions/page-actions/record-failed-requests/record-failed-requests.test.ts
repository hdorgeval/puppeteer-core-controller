import * as puppeteer from 'puppeteer-core';
import * as SUT from './record-failed-requests';
import * as path from 'path';
import { launchBrowser } from '../../browser-actions';
import { getChromePath, stringifyRequest } from '../../../utils';
import { FakeServer } from 'simple-fake-server';
import { recordRequestsTo } from '..';

describe('record failed requests', (): void => {
  let browser: puppeteer.Browser | undefined = undefined;
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
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );
  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: puppeteer.Page | undefined = undefined;
    const errors: puppeteer.Request[] = [];

    // When
    // Then
    const expectedError = new Error(
      'Error: cannot record failed requests because a new page has not been created',
    );
    await SUT.recordFailedRequests(page, [], (req) => errors.push(req)).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should record failed requests HTTP 500', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const errors: puppeteer.Request[] = [];

    fakeServer &&
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    // When
    await SUT.recordFailedRequests(page, [], (req) => errors.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].response()?.status()).toBe(500);
    expect(errors[0].response()?.statusText()).toBe('Internal Server Error');
  });

  test('should record failed requests HTTP 503', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const errors: puppeteer.Request[] = [];
    fakeServer &&
      fakeServer.http
        .get()
        .to('/503')
        .willFail(503);

    // When
    await SUT.recordFailedRequests(page, [], (req) => errors.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-503.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].response()?.status()).toBe(503);
    expect(errors[0].response()?.statusText()).toBe('Service Unavailable');
  });

  test('should record failed requests HTTP 307', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const errors: puppeteer.Request[] = [];
    fakeServer &&
      fakeServer.http
        .get()
        .to('/307')
        .willFail(307);

    // When
    await SUT.recordFailedRequests(page, [], (req) => errors.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-307.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].response()?.status()).toBe(307);
    expect(errors[0].response()?.statusText()).toBe('Temporary Redirect');
  });
  test('should record failed requests HTTP 404', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const errors: puppeteer.Request[] = [];
    fakeServer &&
      fakeServer.http
        .get()
        .to('/404')
        .willFail(404);

    // When
    await SUT.recordFailedRequests(page, [], (req) => errors.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-404.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].response()?.status()).toBe(404);
    expect(errors[0].response()?.statusText()).toBe('Not Found');
  });

  test('should record failed additional requests ', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const errors: puppeteer.Request[] = [];
    fakeServer &&
      fakeServer.http
        .get()
        .to('/other')
        .willFail(408);

    // When
    await SUT.recordFailedRequests(page, [408], (req) => errors.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-other.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].response()?.status()).toBe(408);
    expect(errors[0].response()?.statusText()).toBe('Request Timeout');
  });

  test('should record failed requests due to invalid url', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const errors: puppeteer.Request[] = [];
    const requests: puppeteer.Request[] = [];

    // When
    await SUT.recordFailedRequests(page, [], (req) => errors.push(req));
    await recordRequestsTo('foo/bar', page, (req) => requests.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests.test.html')}`);
    await page.waitFor(10000);

    // Then
    if (requests[0]) {
      // eslint-disable-next-line no-console
      console.log('the following request should be processed as failed:');
      // eslint-disable-next-line no-console
      console.log(await stringifyRequest(requests[0]));
    }

    expect(errors.length).toBeGreaterThanOrEqual(1);
    const failedRequest = errors[0];
    const response = failedRequest.response();

    if (response && response.status() === 307) {
      // this happens when running on windows CI AppVeyor
      // partiallly ignore this test in this case
      return;
    }
    const failedReason = failedRequest.failure();
    expect(failedReason?.errorText).toBe('net::ERR_NAME_NOT_RESOLVED');
    expect(response).toBe(null);
  });
});
