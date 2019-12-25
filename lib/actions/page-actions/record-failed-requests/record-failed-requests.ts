import * as puppeteer from 'puppeteer-core';

const failedStatus = [500, 503, 400, 401, 403];

export async function recordFailedRequests(
  page: puppeteer.Page | undefined,
  callback: (request: puppeteer.Request) => void,
): Promise<void> {
  if (!page) {
    throw new Error(`Error: cannot record failed requests because a new page has not been created`);
  }

  page.on('requestfinished', (request) => {
    const response = request.response();
    if (response === null) {
      callback(request);
      return;
    }

    const status = response.status();
    if (failedStatus.includes(status)) {
      callback(request);
      return;
    }

    // eslint-disable-next-line no-console
    console.log('HDO> requestfinished > request', request);
  });

  page.on('requestfailed', (request) => {
    callback(request);
  });
}
