# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.0-alpha.3](https://github.com/myparcelbe/checkout/compare/v3.1.0-alpha.2...v3.1.0-alpha.3) (2019-11-29)

## [3.1.0-alpha.2](https://github.com/myparcelbe/checkout/compare/v3.1.0-alpha.1...v3.1.0-alpha.2) (2019-11-28)


### Features

* maps functionality ([42869f3](https://github.com/myparcelbe/checkout/commit/42869f300ca44f91a6aae4625e4954fc98f6fa9d))


### Bug Fixes

* **layout:** move carrier logo in pickup location details under the header ([2514c4d](https://github.com/myparcelbe/checkout/commit/2514c4d0d009a9faa581bc3c716b4ff7c1c820e6))
* close button appearing above inline modal and give it a separate class if it is inline to remove padding ([56fc7b9](https://github.com/myparcelbe/checkout/commit/56fc7b9c822c9b0460f0fb7bd2444669994d27ac))
* error on changing address while pickup is selected ([4980635](https://github.com/myparcelbe/checkout/commit/498063564290a6b01a162e8a23d0b3a8a1e60552))
* make modal pass any slots to <component> ([0199183](https://github.com/myparcelbe/checkout/commit/01991833e813eca187cb89120d1131f03864bc20))
* use the js-sdk via npm ([d17a49a](https://github.com/myparcelbe/checkout/commit/d17a49a16e9dd318192ca5e0b4a31e969db9f57e))

## [3.1.0-alpha.1](https://github.com/myparcelbe/checkout/compare/v0.1.1...v3.1.0-alpha.1) (2019-11-18)

### 3.0.27 (2019-11-14)


### Bug Fixes

* no more error on empty address and hides self when it has nothing to show ([ae4dfc5](https://github.com/myparcelbe/checkout/commit/ae4dfc5))

### 3.0.26 (2019-11-13)


### Bug Fixes

* don't update the address if it didn't change, avoiding unnecessary reloading ([a797f62](https://github.com/myparcelbe/checkout/commit/a797f62))

### 3.0.25 (2019-11-13)


### Bug Fixes

* add padding to pickup list icons ([05dca79](https://github.com/myparcelbe/checkout/commit/05dca79))
* add pointer cursor to clickable elements ([13c3a5f](https://github.com/myparcelbe/checkout/commit/13c3a5f))
* improve error handling and fix address error modal not showing in many cases ([3220400](https://github.com/myparcelbe/checkout/commit/3220400))
* simplify logic of error modal ([9a93ca8](https://github.com/myparcelbe/checkout/commit/9a93ca8))
* sort pickup locations by distance only if it is available. otherwise use alphabetical order ([dd932d6](https://github.com/myparcelbe/checkout/commit/dd932d6))

### 3.0.24 (2019-11-11)


### Bug Fixes

* add render event to (re)load the entire app ([472ad56](https://github.com/myparcelbe/checkout/commit/472ad56))


### Features

* first version of pickup locations map feature ([51266d7](https://github.com/myparcelbe/checkout/commit/51266d7))

### 3.0.23 (2019-10-31)

### 3.0.22 (2019-10-25)


### Bug Fixes

* error modal could be closed ([d70b3d5](https://github.com/myparcelbe/checkout/commit/d70b3d5))

### 3.0.21 (2019-10-24)


### Bug Fixes

* add word-break: normal ([e4369fe](https://github.com/myparcelbe/checkout/commit/e4369fe))
* bug that was found by the new tests :) ([1aa820b](https://github.com/myparcelbe/checkout/commit/1aa820b))
* error in getDefaultRequestParameters.js causing the dpd workaround to not work ([9b31ab5](https://github.com/myparcelbe/checkout/commit/9b31ab5))
* Make show_delivery_options do nothing if it was already showing and add missing removeEventListener calls to onDestroy ([126bdb3](https://github.com/myparcelbe/checkout/commit/126bdb3))
* More strict css, less easy for it to be overridden. Fixes opening hours wrapping on long pickup location titles and close modal button not being clickable. ([6ae7336](https://github.com/myparcelbe/checkout/commit/6ae7336))
* remove background-color from modal ([8317a08](https://github.com/myparcelbe/checkout/commit/8317a08))

### 3.0.20 (2019-10-21)

### 3.0.19 (2019-10-07)


### Bug Fixes

* skeleton loader showing forever on loading without anything enabled ([a956d8f](https://github.com/myparcelbe/checkout/commit/a956d8f))
* wrong date format for delivery when delivery days window === 0 ([32ed006](https://github.com/myparcelbe/checkout/commit/32ed006))

### 3.0.18 (2019-10-03)

### 3.0.17 (2019-10-01)

### 3.0.16 (2019-09-26)

### 3.0.15 (2019-09-25)

### 3.0.14 (2019-09-20)

### 3.0.13 (2019-09-18)

### 3.0.12 (2019-09-13)

### 3.0.11 (2019-09-13)

### 3.0.10 (2019-09-12)

### 3.0.9 (2019-09-11)

### 3.0.8 (2019-09-10)

### 3.0.7 (2019-09-09)

### 3.0.6 (2019-09-04)

### 3.0.5 (2019-09-04)

### 3.0.4 (2019-09-03)

### 3.0.3 (2019-09-02)

### 3.0.1 (2019-08-30)

## 3.0.0 (2019-08-30)


### Bug Fixes

* the select of the delivery date ([5d25704](https://github.com/myparcelbe/checkout/commit/5d25704))
