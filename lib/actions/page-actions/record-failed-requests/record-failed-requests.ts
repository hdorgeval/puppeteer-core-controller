import * as puppeteer from 'puppeteer-core';

const failedStatus = [500, 503, 400, 401, 403, 404, 307];

export async function recordFailedRequests(
  page: puppeteer.Page | undefined,
  additionalFailedStatus: number[],
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

    if (additionalFailedStatus.includes(status)) {
      callback(request);
      return;
    }
  });

  page.on('requestfailed', (request) => {
    callback(request);
  });
}
