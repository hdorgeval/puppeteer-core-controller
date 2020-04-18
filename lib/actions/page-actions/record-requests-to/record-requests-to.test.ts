import * as puppeteer from 'puppeteer-core';
import * as SUT from './index';
import * as path from 'path';
import { launchBrowser } from '../../browser-actions';
import { getChromePath } from '../../../utils';
import { FakeServer } from 'simple-fake-server';
import { recordFailedRequests } from '../record-failed-requests';

describe('record requests to', (): void => {
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
      "Error: cannot record requests to '/foo' because a new page has not been created",
    );
    await SUT.recordRequestsTo('/foo', page, (req) => errors.push(req)).catch((error): void =>
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
    const requests: puppeteer.Request[] = [];

    // prettier-ignore
    fakeServer && 
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    // When
    await recordFailedRequests(page, [], (req) => errors.push(req));
    await SUT.recordRequestsTo('/500', page, (req) => requests.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].response()?.status()).toBe(500);
    expect(errors[0].response()?.statusText()).toBe('Internal Server Error');
    expect(requests.length).toBe(1);
    expect(requests[0].response()?.status()).toBe(500);
  });

  test('should record requests to specific url', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const requests: puppeteer.Request[] = [];
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

    // When
    await SUT.recordRequestsTo('/foobar', page, (req) => requests.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-requests-to.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(requests.length).toBe(1);
    expect(requests[0].url()).toContain('?foo=bar');
    expect(requests[0].response()?.status()).toBe(200);
    expect(await requests[0].response()?.json()).toMatchObject(responseBody);
  });

  test('should record requests to different urls', async (): Promise<void> => {
    // Given
    browser = await launchBrowser({
      headless: true,
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    const requests: puppeteer.Request[] = [];
    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };

    const responseBody2 = {
      prop2: 'foobar2',
    };
    const responseHeaders2 = {
      'foo-header': 'bar2',
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

    // When
    await SUT.recordRequestsTo('/foobar', page, (req) => requests.push(req));
    await SUT.recordRequestsTo('/yo', page, (req) => requests.push(req));
    await page.goto(`file:${path.join(__dirname, 'record-requests-to.test.html')}`);
    await page.waitFor(2000);

    // Then
    expect(requests.length).toBe(2);
    expect(requests[0].url()).toContain('/foobar?foo=bar');
    expect(requests[0].response()?.status()).toBe(200);
    expect(await requests[0].response()?.json()).toMatchObject(responseBody);

    expect(requests[1].url()).toContain('/yo?foo=bar');
    expect(requests[1].response()?.status()).toBe(200);
    expect(await requests[1].response()?.json()).toMatchObject(responseBody2);
  });
});
