import * as SUT from '../../controller';
import { LaunchOptions } from '../../../actions';
import * as path from 'path';
import { FakeServer } from 'simple-fake-server';
import { RequestInfo } from '../../../utils';

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

  test('should stringifiy recorded request', async (): Promise<void> => {
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

    const url = `file:${path.join(__dirname, 'controller-stringify-request.test.html')}`;

    // When
    // prettier-ignore
    await pptc
      .initWith(launchOptions)
      .recordRequestsTo('/foobar')
      .navigateTo(url)
      .wait(2000);

    const requests = pptc.getRequestsTo('/foobar');
    const firstRequest = requests[0];
    const result = await pptc.stringifyRequest(firstRequest);
    const requestInfo = JSON.parse(result) as RequestInfo;

    // Then
    const expectedRequestInfo: Partial<RequestInfo> = {
      url: 'http://localhost:1234/foobar?foo=bar',
      method: 'GET',
      response: {
        status: 200,
        headers: { 'foo-header': 'bar' },
        payload: {
          prop1: 'foobar',
        },
      },
    };

    expect(firstRequest).toBeDefined();
    expect(requestInfo).toMatchObject(expectedRequestInfo);
  });
});
