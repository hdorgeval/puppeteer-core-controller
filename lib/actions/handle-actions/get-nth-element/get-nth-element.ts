import * as puppeteer from 'puppeteer-core';

export async function getNthElement(
  index: number,
  elements: puppeteer.ElementHandle<Element>[],
): Promise<puppeteer.ElementHandle<Element>[]> {
  if (index === 0) {
    throw new Error('Index is one-based');
  }
  if (Math.abs(index) > elements.length) {
    return [];
  }

  const currentHandles = [...elements];

  if (index > 0) {
    let nthHandle: puppeteer.ElementHandle<Element> | undefined;
    for (let i = 1; i <= index; i++) {
      nthHandle = currentHandles.shift();
    }
    return nthHandle ? [nthHandle] : [];
  }

  if (index < 0) {
    let nthHandle: puppeteer.ElementHandle<Element> | undefined;
    for (let i = 1; i <= -index; i++) {
      nthHandle = currentHandles.pop();
    }
    return nthHandle ? [nthHandle] : [];
  }

  return [];
}
