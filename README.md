# MyParcel Checkout
[![Build Status](https://travis-ci.com/myparcelbe/checkout.svg?branch=master)](https://travis-ci.com/myparcelbe/checkout)
[![Coverage Status](https://coveralls.io/repos/github/myparcelbe/checkout/badge.svg?branch=master)](https://coveralls.io/github/myparcelbe/checkout?branch=master)

- [Installation](#installation)
- [Requirements](#requirements)
- [Example](#example)
- [Usage](#usage)

## Introduction
This is the MyParcel checkout module. It's used to show your customers the possible delivery and/or pickup options for their location, based on your settings. It barely has any css styling by itself so it should integrate with the design of your website easily.

![alt text](/demo/screenshots/checkout1.png)
![alt text](/demo/screenshots/checkout2.png)
![alt text](/demo/screenshots/checkout3.png)
![alt text](/demo/screenshots/checkout4.png)
![alt text](/demo/screenshots/checkout5.png)

### Support
The checkout is written in [Vue.js], it supports IE9 and up. 

## Example
An example of the checkout functionality can be found in our [sandbox]. Here you can try out every combination of settings and copy the code for your project.

## Installation
1. Clone the repository or download the latest package from [releases].
2. Run the following commands:
```shell script
   $ npm i
   $ npm run build
```
3. Include `dist/myparcel.js` in your project. 
4. Place `<div id="myparcel-checkout"></div>` in your HTML.
5. The checkout will be rendered inside that element!

## Usage
You have to provide a configuration file in the following format as `window.MyParcelConfig` and initialize the checkout with an event.

### Minimum required data
This is the minimum amount of data you need to provide for the checkout to work correctly as a SendMyParcel user.  
```js
window.MyParcelConfig = {
  config: {
    platform: 'belgie',  
  },
  address: {
    cc: 'BE',
    city: 'Antwerpen',
    postalCode: '1000',
  }
};

// Trigger this event on the document to tell the checkout to update.
// Usually only needed on initializing and when the address changes.
document.dispatchEvent(new Event('myparcel_update_checkout'));
```

### All options
```js
window.MyParcelConfig = {
  config: {
    platform: 'belgie',
    carriers: ['bpost', 'dpd'],

    // All settings below can be overridden per carrier via the carrierSettings object
 
    // The price for each option
    priceMorningDelivery: 7.95,
    priceStandardDelivery: 5.85,
    priceEveningDelivery: 6.25,
    priceSignature: 0.35,
    priceOnlyRecipient: 0.30,
    pricePickup: 5.85,
    
    // Additional delivery options
    allowSaturdayDelivery: true,
    allowPickupLocations: true,
    allowSignature: true,
    
    // Other settings
    dropOffDays: '1;2;3;4;5;6',
    cutoffTime: '15:00',
    deliveryDaysWindow: 4,
    dropOffDelay: 1,
    
    // Use this object to override settings per carrier.   
    carrierSettings: {
      bpost: {
        deliveryDaysWindow: 7,
      },
      dpd: {},
    },
  },
  strings: {
    wrongPostalCodeCity: 'Zaterdaglevering',
    saturdayDeliveryTitle: 'Combinatie postcode/plaats onbekend',
    
    // Address strings
    city: 'Plaats',
    postcode: 'Postcode',
    houseNumber: 'Huisnummer',
    addressNotFound: 'Adresgegevens niet ingevuld',

    // Delivery moment titles. 
    // If any of these is not set, the delivery time will be visible instead.
    deliveryEveningTitle: 'Avondlevering',
    deliveryMorningTitle: 'Ochtendlevering',
    deliveryStandardTitle: 'Standaardlevering',
    
    deliveryTitle: 'Bezorgen op',
    pickupTitle: 'Afhalen op locatie',

    // Additional options
    onlyRecipientTitle: 'Home address only',
    signatureTitle: 'Handtekening',

    pickUpFrom: 'Afhalen vanaf',
    openingHours: 'Openingstijden',

    // Other strings
    closed: 'Gesloten',
    discount: 'korting',
    free: 'Gratis',
    from: 'Vanaf',
    loadMore: 'Laad meer',
    retry: 'Opnieuw',
  }, 
  address: {
    cc: 'BE',
    city: 'Antwerpen',
    postalCode: '1000',
  }
};
```

When there is no title set for `deliveryMorningTitle`, `deliveryStandardTitle` or `deliveryEveningTitle` , the delivery time will automatically be visible. For more in-depth explanation of each config item and string and an interactive demo please see our [sandbox]

To get the object with the selected options from the checkout do the following:
```js
const data = document.querySelector('#mypa-input').value;
const obj = JSON.parse(data);

// `obj` will be something like this:
// {
//   "delivery": "deliver", 
//   "deliveryDate": "8-8-2019", 
//   "deliveryMoment": "standard", 
//   "additionalOptions": []
// }
```

## Contribute
1. Clone this repository
2. Run `npm install`
3. Make your changes conforming to the existing code style, we recommend enabling ESLint and using our configuration to make this easier.
4. Test the new code using `npm run serve`
5. Create a pull request!

## Support
If you're experiencing trouble with the implementation we're ready to help you out! Please reach out to us via [support@sendmyparcel.be]

[Vue.js]: https://vuejs.org/
[sandbox]: https://myparcelnl.github.io/api/v2/checkout/sandbox
[support@sendmyparcel.be]: mailto:support@sendmyparcel.be
[releases]: https://github.com/myparcelbe/checkout/releases
