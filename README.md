# puppeteer-core-controller

Fluent API around puppeteer-core

[![Build Status](https://travis-ci.org/hdorgeval/puppeteer-core-controller.svg?branch=master)](https://travis-ci.org/hdorgeval/puppeteer-core-controller)
[![Build status](https://ci.appveyor.com/api/projects/status/5q3m4m4s62knhb72?svg=true)](https://ci.appveyor.com/project/hdorgeval/puppeteer-core-controller)
[![npm version](https://img.shields.io/npm/v/puppeteer-core-controller.svg)](https://www.npmjs.com/package/puppeteer-core-controller)

- [Usage](#usage)
- [Usage in an existing code base](#Usage-in-an-existing-code-base)
- [Usage with Stories](#Usage-with-Stories)
- [API Documentation](#API-Documentation)

# Usage

```js
import { PuppeteerController } from 'puppeteer-core-controller';

const pptc = new PuppeteerController();
const emailInputSelector = 'input#exampleEmail';
const passwordInputSelector = 'input#examplePassword';
const checkMeOutSelector = 'input[type="checkbox"].form-check-input';
const customSelect = 'select#exampleCustomSelect';
const option = 'Value 3';

await pptc
  .initWith({
    headless: false,
  })
  .withMaxSizeWindow()
  .withCursor()
  .navigateTo('https://reactstrap.github.io/components/form/')
  .hover(emailInputSelector)
  .click(emailInputSelector)
  .typeText('foo.bar@baz.com')
  .pressKey('Tab');
  .expectThat(passwordInputSelector).hasFocus()
  .typeText("don't tell!")
  .pressKey('Tab');
  .expectThat(passwordInputSelector).hasClass('is-valid')
  .hover(checkMeOutSelector)
  .click(checkMeOutSelector)
  .select(option).in(customSelect)
  .close();
```

# Usage in an existing code base

```js
import { PuppeteerController } from 'puppeteer-core-controller';

// existing code that has a browser and page instance
// ...

const pptc = new PuppeteerController(browser, page);
const emailInputSelector = 'input#exampleEmail';
const passwordInputSelector = 'input#examplePassword';
const checkMeOutSelector = 'input[type="checkbox"].form-check-input';
const customSelect = 'select#exampleCustomSelect';
const option = 'Value 3';

await pptc
  .navigateTo('https://reactstrap.github.io/components/form/')
  .click(emailInputSelector)
  .typeText('foo.bar@baz.com')
  .pressKey('Tab');
  .expectThat(passwordInputSelector).hasFocus()
  .typeText("don't tell!")
  .pressKey('Tab');
  .expectThat(passwordInputSelector).hasClass('is-valid')
  .click(checkMeOutSelector)
  .select(option).in(customSelect)
  .close();
```

# Usage with Stories

```js
import { PuppeteerController, Story, StoryWithProps } from 'puppeteer-core-controller';

const pptc = new PuppeteerController();
const launchOptions: LaunchOptions = {
  headless: true,
};
const url = 'https://reactstrap.github.io/components/form';
const customSelect = 'select#exampleCustomSelect';
const option = 'Value 3';

interface StartOptions {
  launchOptions: LaunchOptions;
  url: string;
}

const openApplication: StoryWithProps<StartOptions> = async (pptc, props) => {
  await pptc
    .initWith(props.launchOptions)
    .withMaxSizeWindow()
    .withCursor()
    .navigateTo(props.url);
};

const fillForm: Story = async (pptc) => {
  await pptc
    .click(customSelect)
    .select(option)
    .in(customSelect);
};

const params: StartOptions = { launchOptions, url };
await pptc
  .runStory(openApplication, params)
  .runStory(fillForm)
  .close();
```

# API Documentation

- Chainable Methods

  - [initWith([options])](#initWithoptions)
  - [recordFailedRequests()](#recordFailedRequests)
  - [recordPageErrors()](#recordPageErrors)
  - [withMaxSizeWindow([minViewPort])](#withMaxSizeWindowminViewPort)
  - [withCursor()](#withCursor)
  - [navigateTo(url)](#navigateTourl)
  - [hover(selector[, options])](#hoverselector-options)
  - [clear(selector[, options])](#clearselector-options)
  - [click(selector[, options])](#clickselector-options)
  - [typeText(text[, options])](#typeTexttext-options)
  - [pressKey(key[, options])](#pressKeykey-options)
  - [select(values).in(selector[, options])](#selectvaluesinselector-options)
  - [find(selector[, waitOptions]).withText(text).click([clickOptions])](#findselector-waitOptionswithTexttextclickclickOptions)
  - [find(selector[, waitOptions]).withExactText(text).click([clickOptions])](#findselector-waitOptionswithExactTexttextclickclickOptions)
  - [runStory(story)](#runStorystory)
  - [wait(duration)](#waitduration)

- Chainable Assertions

  - [expectThat(selector).hasClass(className,[options])](#expectThatSelectorhasClassclassNameoptions)
  - [expectThat(selector).hasExactValue(value,[options])](#expectThatselectorhasexactvaluevalueoptions)
  - [expectThat(selector).hasFocus([options])](#expectThatselectorhasFocusoptions)
  - [expectThat(selector).hasText(text,[options])](#expectThatselectorhastexttextoptions)
  - [expectThat(selector).isDisabled([options])](#expectThatselectorisDisabledoptions)
  - [expectThat(selector).isEnabled([options])](#expectThatselectorisEnabledoptions)
  - [expectThat(selector).isVisible([options])](#expectThatselectorisVisibleoptions)
  - [expectThat(selector).isNotVisible([options])](#expectThatselectorisNotVisibleoptions)

- Helper Methods and Properties

  - [cast(any)](#castany)
  - [clearFailedRequests()](#clearFailedRequests)
  - [clearPageErrors()](#clearPageErrors)
  - [currentPage](#currentPage)
  - [getClientRectangleOf(selector)](#getClientRectangleOfselector)
  - [getComputedStyleOf(selector)](#getComputedStyleOfselector)
  - [getCurrentUrl()](#getCurrentUrl)
  - [getFailedRequests()](#getFailedRequests)
  - [getInnerTextOf(selector)](#getInnerTextOfselector)
  - [getInstances()](#getInstances)
  - [getPageErrors()](#getPageErrors)
  - [getSelectedOptionOf(selector)](#getSelectedOptionOfselector)
  - [getAllOptionsOf(selector)](#getAllOptionsOfselector)
  - [getValueOf(selector)](#getValueOfselector)
  - [isChecked(selector)](#isCheckedselector)
  - [isDisabled(selector)](#isDisabledselector)
  - [isVisible(selector)](#isVisibleselector)
  - [isNotVisible(selector)](#isNotVisibleselector)
  - [takeFullPageScreenshotAsBase64([options])](#takeFullPageScreenshotAsBase64options)

## Chainable Methods

### initWith([options])

- options: same object as [puppeteer.launch([options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#puppeteerlaunchoptions)

---

### withMaxSizeWindow([minViewPort])

- maximize the window size. Should be called after `initWith` and before all other actions.

- minViewPort: {minWidth: number, minHeight: number }
  This method might not work on CI environment. In this case setup the minViewPort parameter to ensure the page has a minimum width and height.

---

### withCursor()

- show a cursor that is bound to the current mouse position. This method should be called before navigateTo(url).

![demo withCursor](demos/withCursor.gif)

---

### recordPageErrors()

- track and record page errors. Should be called after `initWith`.
- use `getPageErrors()` helper method on the controller to access errors that have occurred.
- use `clearPageErrors()` helper method on the controller to clear all past errors.

---

### recordFailedRequests()

- track and record failed requests. Should be called after `initWith`.
- use `getFailedRequests()` helper method on the controller to access errors that have occurred.
- use `clearFailedRequests()` helper method on the controller to clear all past errors.

---

### navigateTo(url)

- navigate to the specified url

---

### click(selector[, options])

- selector: string
- options: same object as [page.click(selector[, options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pageclickselector-options)

  with an additional property: `timeoutInMilliseconds`. This option enables the click method to wait for the selector to appear in the DOM before attempting to click on it. Defaults to 30000 (30 seconds). Pass 0 to disable this timeout.

---

### hover(selector[, options])

- selector: string
- options: {steps: number, timeoutInMilliseconds: number }

  `timeoutInMilliseconds` option enables the hover method to wait for the selector to appear in the DOM before attempting to move the mouse on it. Defaults to 30000 (30 seconds). Pass 0 to disable this timeout.

---

### typeText(text[, options])

- text: string
- options: same object as [keyboard.type(text[, options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#keyboardtypetext-options)

  except that `delay` defaults to 50 milliseconds. Set the `delay` value to `0` to disable the delay.

---

### clear(selector[, options])

Clear text in an input box.

- selector: string
- options: same object as [page.click(selector[, options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pageclickselector-options)

This method does not wait for the selector to be in the DOM.
In some cases you might have to wait that the input field is visible before clearing it's value:

```js
const value = await pptc
  .expectThat(selector)
  .isVisible()
  .hover(selector)
  .clear(selector);
```

---

### pressKey(key[, options])

- key: 'Tab' | 'Backspace' | 'Enter'
- options: same object as [keyboard.press(key[, options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#keyboardpresskey-options)

  except that `delay` defaults to 50 milliseconds. Set the `delay` value to `0` to disable the delay.

---

### select(values).in(selector[, options])

- values and selector: same as [page.select(selector, ...values)](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pageselectselector-values)
- options: {timeoutInMilliseconds}. This option enables the select method to wait for the selector to appear in the DOM before attempting to select the option(s). Defaults to 30000 (30 seconds). Pass 0 to disable this timeout.

---

### find(selector[, waitOptions]).withText(text).click([clickOptions])

find a selector whose innerText property contains `text`, then click on it.

```js
await pptc
  .initWith({ headless: true })
  .withCursor()
  .navigateTo('https://reactstrap.github.io')
  .find('a.btn')
  .withText('Components')
  .click();
```

- selector: string
- waitOptions: {timeoutInMilliseconds: number}.
  The find method will wait for the selector to to be visible until `timeoutInMilliseconds` expires. Defaults to 30000 (30 seconds).
- withText(text)
- clickOptions: same object as [page.click(selector[, options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pageclickselector-options)

---

### find(selector[, waitOptions]).withExactText(text).click([clickOptions])

find a selector whose innerText property is exactly equal to `text`, then click on it.

```js
await pptc
  .initWith({ headless: true })
  .withCursor()
  .navigateTo('https://reactstrap.github.io')
  .find('a.btn')
  .withExactText('Components')
  .click();
```

- selector: string
- waitOptions: {timeoutInMilliseconds: number}.
  The find method will wait for the selector to to be visible until `timeoutInMilliseconds` expires. Defaults to 30000 (30 seconds).
- withExactText(text)
- clickOptions: same object as [page.click(selector[, options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pageclickselector-options)

---

### runStory(story)

- story: Story | StoryWithProps

---

### wait(duration)

- duration: number

  time to wait in milliseconds.

---

## Assertion API

### expectThat(selector).hasFocus([options])

- selector: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to have the focus. Defaults to 30000 (30 seconds).

---

### expectThat(selector).hasClass(className,[options])

- selector: string
- className: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to have the specified class. Defaults to 30000 (30 seconds).

---

### expectThat(selector).hasExactValue(value,[options])

- selector: string
- value: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to have the specified value. Defaults to 30000 (30 seconds).

```js
await pptc
  .click(emailInputSelector)
  .typeText('foo.bar@baz.com')
  .expectThat(emailInputSelector)
  .hasExactValue('foo.bar@baz.com');
```

---

### expectThat(selector).hasText(text,[options])

- selector: string
- text: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to have the specified value. Defaults to 30000 (30 seconds).

```js
await pptc
  .expectThat(selector)
  .isVisible()
  .expectThat(selector)
  .hasText(text);
```

---

### expectThat(selector).isDisabled([options])

- selector: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to be disabled. Defaults to 30000 (30 seconds).

---

### expectThat(selector).isEnabled([options])

- selector: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to be enabled. Defaults to 30000 (30 seconds).

---

### expectThat(selector).isVisible([options])

- selector: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to be visible. Defaults to 30000 (30 seconds).

---

### expectThat(selector).isNotVisible([options])

- selector: string
- options: {timeoutInMilliseconds}. This option enables the assertion mechanism to wait for the selector to be hidden or to disappear from the DOM. Defaults to 30000 (30 seconds).

---

## Helper Methods and Properties

### getComputedStyleOf(selector)

- selector: string
- returns: `Promise<CSSStyleDeclaration>`

  ```js
  const validInput = 'input[type="text"].is-valid.form-control';
  const computedStyles = await pptc.getComputedStyleOf(validInput);
  expect(computedStyles.borderColor).toBe('rgb(40, 167, 69)');
  ```

---

### getClientRectangleOf(selector)

- selector: string

  ```js
  const selector = 'input[type="text"].is-valid.form-control';
  const selectorClientRectangle = await pptc.getClientRectangleOf(selector);

  const middleX = selectorClientRectangle.left + selectorClientRectangle.width / 2;
  const middleY = selectorClientRectangle.top + selectorClientRectangle.height / 2;

  const expectedMiddleX = 100;
  const expectedMiddleY = 100;

  expect(Math.abs(middleX - expectedMiddleX)).toBeLessThanOrEqual(1);
  expect(Math.abs(middleY - expectedMiddleY)).toBeLessThanOrEqual(1);
  ```

---

### getCurrentUrl()

- returns: `Promise<string>`

---

### isChecked(selector)

- selector: string
- returns: `Promise<boolean>`

---

### isDisabled(selector)

- selector: string
- returns: `Promise<boolean>`

---

### isVisible(selector)

- selector: string
- returns: `Promise<boolean>`

---

### isNotVisible(selector)

- selector: string
- returns: `Promise<boolean>`

---

### getAllOptionsOf(selector)

- selector: string
- returns: `Promise<SelectOptionInfo[]>`

```ts
SelectOptionInfo {
  value: string;
  label: string;
  selected: boolean;
}
```

---

### getSelectedOptionOf(selector)

- selector: string
- returns: `Promise<string>`

---

### getValueOf(selector)

- selector: string
- returns: `Promise<string>`

This method does not wait for the selector to be in the DOM.
In some cases you might have to wait that the input field is visible before getting it's value:

```js
const value = await pptc
  .expectThat(selector)
  .isVisible()
  .getValueOf(selector);
```

---

### getInnerTextOf(selector)

- selector: string
- returns: `Promise<string>`

This method does not wait for the selector to be in the DOM.
In some cases you might have to wait that the input field is visible before getting it's value:

```js
const text = await pptc
  .expectThat(selector)
  .isVisible()
  .getInnerTextOf(selector);
```

---

### takeFullPageScreenshotAsBase64([options])

- options: same object as [page.screenshot([options])](https://github.com/puppeteer/puppeteer/blob/v2.0.0/docs/api.md#pagescreenshotoptions)

  ```js
  const screenshot = await pptc.takeFullPageScreenshotAsBase64();
  ```

---

### currentPage

- get page instance of the controller in order to do stuff not covered by this API.

  ```js
  const pptc = new PuppeteerController();

  // use the pptc controller API
  // ...

  const page = pptc.currentPage; // this is a property
  // now use this page instance through the puppeteer API
  ```

---

### getInstances()

- get browser and page instances of the controller in order to do stuff not covered by this API.

  ```js
  const pptc = new PuppeteerController();

  // use the pptc controller API
  // ...

  const [browser, page] = pptc.getIntances();
  // now use the browser and page instances through the puppeteer API
  ```

---

### getPageErrors()

- get page errors that occurred while executing the test.

  ```js
  await pptc
      .initWith(launchOptions)
      .recordPageErrors()
      .navigateTo(url)
      ...
      .close();

  const errors: Error[] = pptc.getPageErrors();
  // analyse errors by iterating on the returned array
  // an empty array means that no error has occurred or that you forgot to call the recordPageErrors() method
  ```

---

### clearPageErrors()

- clear page errors that occurred. Usefull if you want to track page errors only after a specific context has been setup on the page.

---

### getFailedRequests()

- get failed requests that occurred while executing the test.
- returns: `Request[]`.

  See [Request](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-request)

  ```js
  await pptc
      .initWith(launchOptions)
      .recordFailedRequests()
      .navigateTo(url)
      ...
      .close();

  const errors: puppeteer.Request[] = pptc.getFailedRequests();
  // analyse errors by iterating on the returned array
  // an empty array means that no error has occurred or that you forgot to call the recordFailedRequests() method
  ```

---

### clearFailedRequests()

- clear failed requests that occurred. Usefull if you want to track failed requests only after a specific context has been setup on the page.

---

### cast(any)

- cast input object as a PuppeteerController instance; usefull when a PuppeteerController instance is stored in an untyped context like in cucumberJS.

```js
const pptc = cast(this.context.pptc);
// use the pptc controller API
// ...
```

---
