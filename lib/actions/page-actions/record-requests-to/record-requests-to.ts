import * as puppeteer from 'puppeteer-core';

export async function recordRequestsTo(
  partialUrl: string,
  page: puppeteer.Page | undefined,
  callback: (request: puppeteer.Request) => void,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Error: cannot record requests to '${partialUrl}' because a new page has not been created`,
    );
  }

  page.on('requestfinished', (request) => {
    const requestedUrl = request.url();
    if (requestedUrl && requestedUrl.includes(partialUrl)) {
      callback(request);
      return;
    }
  });

  page.on('requestfailed', (request) => {
    const requestedUrl = request.url();
    if (requestedUrl && requestedUrl.includes(partialUrl)) {
      callback(request);
      return;
    }
  });
}
