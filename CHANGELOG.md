# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)

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
