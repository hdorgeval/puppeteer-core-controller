import * as puppeteer from 'puppeteer-core';

export async function getClientRectangleOf(
  selector: string,
  page: puppeteer.Page | undefined,
): Promise<ClientRect> {
  if (!page) {
    throw new Error(
      `Error: cannot get the client rectangle of '${selector}' because a new page has not been created`,
    );
  }

  const stringifiedResult = await page.$eval(selector, (el: Element): string => {
    const clientRectangle = el && el.getBoundingClientRect();
    const result: ClientRect = {
      bottom: clientRectangle ? clientRectangle.bottom : 0,
      height: clientRectangle ? clientRectangle.height : 0,
      top: clientRectangle ? clientRectangle.top : 0,
      width: clientRectangle ? clientRectangle.width : 0,
      left: clientRectangle ? clientRectangle.left : 0,
      right: clientRectangle ? clientRectangle.right : 0,
    };
    return JSON.stringify(result);
  });

  const clientRectangle = JSON.parse(stringifiedResult) as ClientRect;
  return Promise.resolve(clientRectangle);
}
