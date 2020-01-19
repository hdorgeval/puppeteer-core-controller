# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

## [1.31.0] - 2020-01-19

### Added

- add `pasteText(text[, options])` to the Fluent API

## [1.30.0] - 2020-01-15

### Added

- add `waitForStabilityOf(func)` to the Fluent API

## [1.29.0] - 2020-01-13

### Added

- add helper method stringifyRequest(request) to the Controller API

## [1.28.0] - 2020-01-12

### Added

- be able to scroll the viewport when hovering over a selector

## [1.27.0] - 2020-01-08

### Added

- add a verbose option to be able to debug the waitUntil() method

## [1.26.0] - 2020-01-07

### Added

- add helper method `exists()` to the Selector API
- add helper method `doesNotExist()` to the Selector API

## [1.25.0] - 2020-01-05

### Added

- add helper method `isDisabled()` to the Selector API

### Fixed

- fix algorithm that checks selector is moving

## [1.24.0] - 2020-01-02

### Added

- add `withValue(text)` to the Selector API

## [1.23.0] - 2020-01-01

### Added

- add `recordRequestsTo(url)` to the Fluent API
- add helper method `getRequestsTo(url)` to the controller
- add helper method `getLastRequestTo(url)` to the controller
- add helper method `clearRequestsTo(url)` to the controller

## [1.22.0] - 2019-12-29

### Added

- add `waitUntil(predicate)` to the Fluent API
- add helper method `getFirstHandleOrNull()` to the Selector API
- add helper method `count()` to the Selector API

## [1.21.2] - 2019-12-27

### Fixed

- fix(controller): select by label instead of by value

## [1.21.1] - 2019-12-26

### Fixed

- do not throw while checking selector existence

## [1.21.0] - 2019-12-26

### Added

- add `expectThat(selector).hasAttribute(attributeName).withValue(attributeValue)` method in the fluent assertion API

- add `isVisible()` helper method on the Selector API

### Fixed

- do not throw while checking selector existence

## [1.20.0] - 2019-12-23

### Added

- add `find(selector)` method on the Selector API
- add `withText(text)` method on the Selector API
- add `nth(index)` method on the Selector API
- add `parent()` method on the Selector API

### Changed

- update dependencies

## [1.19.0] - 2019-12-20

### Added

- add `getAllOptionsOf(selector)` helper method on the controler

### Fixed

- Trying to select an unknown option in a SELECT changes the currently selected option and triggers a value change: now there is an explicit check that the option is available in the SELECT.

## [1.18.0] - 2019-12-18

### Added

- add `selector()` method on the controller as an entry point to a new Selector API

  This Selector API will enable to target dom elements that are embedded in complex dom hierarchy or repeated components

- add `currentPage` helper property on the controler

## [1.17.0] - 2019-12-17

### Added

- add `expectThat(selector).hasText(text)` method in the fluent assertion API
- add `getInnerTextOf()` helper method on the controler

## [1.16.1] - 2019-12-16

### Fixed

- fix(assert): adapt waiting mechanism to handle rapid changes in DOM

## [1.16.0] - 2019-12-15

### Added

- be able to call `recordFailedRequests()` and `recordPageErrors()` before page instance creation

## [1.15.0] - 2019-12-15

### Added

- add `recordFailedRequests()` method in the fluent API
- add `getFailedRequests()` helper method on the controller
- add `clearFailedRequests()` helper method on the controller

## [1.14.0] - 2019-12-12

### Added

- add `wait(duration)` method in the fluent API
- add `recordPageErrors()` method in the fluent API
- add `getPageErrors()` helper method on the controller
- add `clearPageErrors()` helper method on the controller

## [1.13.0] - 2019-12-12

### Added

- add `clear(selector)` method in the fluent API

## [1.12.2] - 2019-12-11

### Fixed

- fix(controller): be able to handle simple types in StoryWithProps

### Changed

- update dev dependencies

## [1.12.1] - 2019-12-11

### Fixed

- fix(controller): handle null or undefined values for the value property of an HTML element

## [1.12.0] - 2019-12-10

### Added

- add `expectThat(selector).isVisible()` method in the fluent assertion API
- add `expectThat(selector).isNotVisible()` method in the fluent assertion API
- add `isVisible(selector)` helper method on the controller
- add `isNotVisible(selector)` helper method on the controller

## [1.11.1] - 2019-12-08

### Fixed

- fix(page-actions): throw an error when trying to select an unknown option

## [1.11.0] - 2019-12-07

### Added

- add `expectThat(selector).isDisabled()` method in the fluent assertion API
- add `expectThat(selector).isEnabled()` method in the fluent assertion API
- add `isDisabled(selector)` helper method on the controller

## [1.10.0] - 2019-12-07

### Fixed

- remove `console.log` generated on `click()`, `hover()`, `select()` methods
- keep comments on compiled code

### Added

- be able to specify a minimum page width and page height in `withMaxSizeWindow()` method

## [1.9.0] - 2019-12-05

### Added

- add `expectThat(selector).hasExactValue(value)` method in the fluent API

## [1.8.0] - 2019-12-04

### Added

- be able to wait until the selector does not move any more (due to CSS animation for example) on following actions: `hover`, `click`, `select`.

  Note: a console.log is emitted to check the behavior of this internal waiting mechanism on production Apps. Feedback is welcomed about those logs.

## [1.7.0] - 2019-11-30

### Added

- be able to take a screenshot of the full page as base64 image

## [1.6.0] - 2019-11-29

### Added

- be able to create and run async stories

## [1.5.0] - 2019-11-24

### Changed

- update dependencies
- fix vulnerabilities

### Added

- add find(selector).withExactText(text).click() to the fluent API

## [1.4.0] - 2019-11-21

### Added

- add find(selector).withText(text).click() to the fluent API

## [1.3.0] - 2019-11-18

### Added

- add `cast()` method in the fluent API

## [1.2.0] - 2019-11-17

### Added

- add `hover(selector)` method in the fluent API

## [1.1.0] - 2019-11-16

### Added

- add `withCursor` method in the fluent API
- add `getClientRectangleOf()` method in the fluent API

## [1.0.0] - 2019-11-12

### Changed

- update dependencies
- fix vulnerabilities

### Added

- be able to create a new controller by using an existing browser and page instance;
- be able to get internal browser and page instances to do stuff not covered by this API;

## [0.8.0] - 2019-07-31

### Added

- add `expectThat(selector).hasClass()` method in the fluent API

## [0.7.0] - 2019-07-30

### Added

- add `runStory` method in the fluent API

## [0.6.0] - 2019-07-30

### Added

- add `getComputedStyleOf()` method in the fluent API

## [0.5.0] - 2019-07-24

### Added

- create framework for an assertion API
- add `expectThat(selector).hasFocus()` method in the fluent API

## [0.4.0] - 2019-07-22

### Added

- implement `select()` method in the fluent API

## [0.3.0] - 2019-07-21

### Added

- implement `pressKey()` method in the fluent API

## [0.2.1] - 2019-07-21

### Fixed

- add missing infos in package.json

## [0.2.0] - 2019-07-21

### Added

- implement `typeText()` method in the fluent API

## [0.1.0] - 2019-07-20

### Fixed

- fix typings and entry point in npm package

## [0.0.2] - 2019-07-20

### Added

- implement `click()` method in the fluent API

## [0.0.1] - 2019-07-19

### Added

- implement minimalist fluent API around puppeteer-core
