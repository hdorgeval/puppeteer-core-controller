import * as puppeteer from 'puppeteer-core';

export interface RequestInfo {
  url: string;
  method: string;
  error: {
    errorText: string;
  } | null;
  headers: { [key: string]: string };
  postData: string | undefined;
  response: ResponseInfo | null;
}

export interface ResponseInfo {
  headers: { [key: string]: string };
  status: number;
  payload: string | undefined;
}

function toFormattedJsonOrDefault(data: string | undefined): string | undefined {
  try {
    if (!data) {
      return data;
    }
    return JSON.stringify(JSON.parse(data), null, 2);
  } catch (error) {
    return data;
  }
}

async function toFormattedJsonOrText(response: puppeteer.Response): Promise<string> {
  try {
    const payload = (await response.json()) as string;
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch (error) {
    return await response.text();
  }
}
export async function stringifyRequest(request: puppeteer.Request): Promise<string> {
  const requestInfo: RequestInfo = {
    url: request.url(),
    method: request.method(),
    error: request.failure(),
    headers: request.headers(),
    postData: toFormattedJsonOrDefault(request.postData()),
    response: null,
  };

  const response = request.response();
  if (response === null) {
    const result = JSON.stringify(requestInfo, null, 2);
    return result;
  }

  let body: string | undefined = undefined;
  try {
    body = await toFormattedJsonOrText(response);
  } catch (error) {
    // ignore error
  }

  const responseInfo: ResponseInfo = {
    status: response.status(),
    headers: response.headers(),
    payload: body,
  };

  requestInfo.response = responseInfo;
  const result = JSON.stringify(requestInfo, null, 2);
  return result;
}
