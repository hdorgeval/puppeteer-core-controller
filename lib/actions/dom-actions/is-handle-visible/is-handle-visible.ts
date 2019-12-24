import * as puppeteer from 'puppeteer-core';
declare const window: Window;
export async function isHandleVisible(
  selector: puppeteer.ElementHandle<Element> | undefined,
): Promise<boolean> {
  if (selector === undefined) {
    return false;
  }

  const isVisibleInViewPort = await selector.isIntersectingViewport();
  if (!isVisibleInViewPort) {
    return false;
  }

  const result = await selector.evaluate((el): boolean => {
    function hasVisibleBoundingBox(element: Element): boolean {
      const rect = element.getBoundingClientRect();
      return !!(rect.top || rect.bottom || rect.width || rect.height);
    }

    const style = window.getComputedStyle(el);

    if (style && style.opacity && style.opacity === '0') {
      return false;
    }

    const isVisible = style && style.visibility !== 'hidden' && hasVisibleBoundingBox(el);
    return isVisible;
  });

  return result;
}
