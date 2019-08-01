# MyParcel Checkout
[![Build Status](https://travis-ci.com/myparcelbe/checkout.svg?branch=master)](https://travis-ci.com/myparcelbe/checkout)
[![Coverage Status](https://coveralls.io/repos/github/myparcelbe/checkout/badge.svg?branch=master)](https://coveralls.io/github/myparcelbe/checkout?branch=master)

- [Installation](#installation)
- [Requirements](#requirements)
- [Example](#example)
- [Usage](#usage)

## Introduction
This is the MyParcel checkout meant to 

## Installation
1. Download the latest package from [releases](https://github.com/myparcelbe/checkout/releases).
2. Include `dist/myparcel.js` in your project. 
3. Place `<div id="myparcel-checkout"></div>` in your HTML.
4. The checkout will be rendered inside that element!

### Example
An example of the checkout functionality can be found via our [Sandbox](https://myparcelbe.github.io/checkout/sandbox/) example.

### Usage
You have to provide a configuration file like this as `window.MyParcelConfig`:

```js
const data = {
    address: {
        cc: 'BE',
        postalCode: '2000',
        number: '16',
        city:'Antwerpen'
    },
    txtWeekDays: [
        'Zondag',
        'Maandag',
        'Dinsdag',
        'Woensdag',
        'Donderdag',
        'Vrijdag',
        'Zaterdag'
    ],
    config: {
        "apiBaseUrl": "https://api.sendmyparcel.be/",
        "carrier": "1",
    
        "priceMorningDelivery": "10.00",
        "priceStandardDelivery": "5.85",
        "priceEveningDelivery": "1.25",
        "priceSignature": "0.36",
        "priceOnlyRecipient":"0.29",
        "pricePickup": "5.85",
    
        "deliveryTitle":"Bezorgen op",
        "pickupTitle":"Afhalen op locatie",
        "deliveryStandardTitle":"Standaard levering",
        "signatureTitle": "Handtekening",
    
        "allowSaturdayDelivery": true,
        "allowSignature": true,
        "allowPickupPoints": true,
    
        "dropOffDays": "1;2;3;4;5;6",
        "cutoffTime": "15:00",
        "deliveryDaysWindow": "5",
        "dropOffDelay":"1"
    }
 };
```

The above values of the array are configurable. As soon as a value changes it will be visible in the checkout.

When there is no title set for `deliveryMorningTitle`, `deliveryStandardTitle` or `deliveryEveningTitle` , the delivery time will automatically be visible.

To get the object with the selected option of the user do the following

```js
json = document.querySelector('#mypa-input').value;
obj = JSON.parse(json);
```

### Contribute
1. Clone this repository
2. Run `npm install`

- [Node](https://nodejs.org)


### Support
When you're experiencing trouble with the implementation we're ready to help you out! Please reach out to us via support@sendmyparcel.be or Slack us: 
