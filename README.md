# MyParcel Delivery Options
[![Build Status](https://travis-ci.com/myparcelbe/checkout.svg?branch=master)](https://travis-ci.com/myparcelbe/checkout)
[![Coverage Status](https://coveralls.io/repos/github/myparcelbe/checkout/badge.svg?branch=master)](https://coveralls.io/github/myparcelbe/checkout?branch=master)

- [Installation](#installation)
- [Requirements](#requirements)
- [Example](#example)
- [Usage](#usage)

## Introduction
This is the MyParcel delivery options module for use in any e-commerce platform's checkout. It's used to show your customers the possible delivery and/or pickup options for their location, based on your settings. It only has the bare minimum css styling so it should integrate with the design of your webshop easily.

![screenshot](/src/delivery-options/data/demo/screenshots/checkout1.png)
![screenshot](/src/delivery-options/data/demo/screenshots/checkout2.png)
![screenshot](/src/delivery-options/data/demo/screenshots/checkout3.png)
![screenshot](/src/delivery-options/data/demo/screenshots/checkout4.png)
![screenshot](/src/delivery-options/data/demo/screenshots/checkout5.png)

### Browser support
This app is written in [Vue.js], it supports IE9 and up. 

## Example
An example of the delivery options functionality can be found in our [sandbox]. Here you can try out every combination of settings and copy the code for use in your project.

## Installation
1. Clone the repository or download the latest package from [releases].
2. Run the following commands:
```shell script
   $ npm i
   $ npm run build
```
3. Include `dist/myparcel.js` in your project. 
4. Place `<div id="myparcel-delivery-options"></div>` in your HTML.
5. Follow the usage instructions. 
6. The delivery options will be rendered inside the div created in step 4.

## Usage



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
    
    // Shipment options
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

    // Shipment options
    onlyRecipientTitle: 'Home address only',
    signatureTitle: 'Handtekening',

    pickUpFrom: 'Afhalen vanaf',
    openingHours: 'Openingstijden',

    // Other strings
    closed: 'Gesloten',
    free: 'Gratis',
    from: 'Vanaf',
    loadMore: 'Laad meer',
    retry: 'Opnieuw',
  }, 
  address: {
    cc: 'BE',
    city: 'Antwerpen',
    postalCode: '2000',
  }
};
```

When there is no title set for `deliveryMorningTitle`, `deliveryStandardTitle` or `deliveryEveningTitle` , the delivery time will automatically be visible. For more in-depth explanation of each config item and string and an interactive demo please see our [sandbox]

To get the object with the selected options from the delivery options do the following:
```js
const data = document.querySelector('#mypa-input').value;
const obj = CODE_FORMAT_JSON.parse(data);

// `obj` will be something like this:
// {
//   "delivery": "deliver", 
//   "deliveryDate": "8-8-2019", 
//   "deliveryMoment": "standard", 
//   "shipmentOptions": {signature: true, only_recipient: false}
// }
```

## Examples
These examples assume you've already loaded the delivery options in your page. See [Installation] if you haven't. 
You have to provide a configuration file in the following format as `window.MyParcelConfig` and initialize the delivery options with an event.

### Setting up the configuration
This is an example.  
```js
window.MyParcelConfig = {
  config: {
    platform: 'belgie', // REQUIRED!
    carrierSettings: {
      bpost: {
        allowDeliveryOptions: true,
        allowPickupLocations: true,
      },
      dpd: {
        allowDeliveryOptions: true,
        allowPickupLocations: true,
      },
    },
  },
  address: {
    cc: 'BE',
    city: 'Antwerpen',
    postalCode: '2000',
  },
};

// Trigger this event on the document to tell the delivery options to update.
// Usually only needed on initializing and when the address changes.
document.dispatchEvent(new Event('myparcel_update_delivery_options'));
```

### Getting the address from your environment
1. Set up the link between the address fields and the delivery options:
   ```js
   /**
    * Get data from form fields and put it in the global MyParcelConfig.
    */
   function updateAddress() {
     window.MyParcelConfig.address = {
       cc: document.querySelector('#country').value,
       postalCode: document.querySelector('#house_number').value,
       number: document.querySelector('#postcode').value,
       city: document.querySelector('#address_1').value,
     };
   
     /* 
      * Send the event that tells the delivery options module to reload data. 
      */
     document.dispatchEvent(new Event('myparcel_update_delivery_options'));
   
     // IE9–11 compatible example
     var event = document.createEvent('HTMLEvents');
     event.initEvent('myparcel_update_delivery_options', true, false);
     document.querySelector('body').dispatchEvent(event);
   }
   ```
1. Add event listeners to each address field to execute this function:
    ```js
    // ES6 example, use var for older environments.
    const addressFields = [
      '<Country field selector>',
      '<Postal code field selector>',
      '<Address line 1 field selector>',
    ];
    
    addressFields.forEach((field) => {
      document.querySelector(field).addEventListener('change', updateAddress);
    });
    ```
1. Now, when an user changes the value in any of the fields set in `addressFields` the `window.MyParcelConfig` will be updated and the delivery options module will receive the event that tells it to update. The delivery options will reload and fetch the available options for the new address.

### Usage in forms
You'll often want to use the delivery options module in a checkout form in your webshop software. We have implemented it in WooCommerce and Magento2 using the following method to get its data in the `$_POST` variable on submitting the form.
1. Follow the steps in [Installation] and 


## Contribute
1. Clone this repository
2. Run `npm install`
3. Make your changes conforming to the existing code style, we recommend enabling ESLint and using our configuration to make this easier.
4. Test the new code using `npm run serve`
5. Create a pull request!

## Support
If you're experiencing trouble with the implementation we're ready to help you out! Please reach out to us via [support@sendmyparcel.be] or join our support community on [Slack].

[Vue.js]: https://vuejs.org/
[sandbox]: https://myparcelnl.github.io/api/v2/checkout/sandbox
[support@sendmyparcel.be]: mailto:support@sendmyparcel.be
[releases]: https://github.com/myparcelbe/checkout/releases
[Slack]: https://join.slack.com/t/myparcel-dev/shared_invite/enQtNDkyNTg3NzA1MjM4LTM0Y2IzNmZlY2NkOWFlNTIyODY5YjFmNGQyYzZjYmQzMzliNDBjYzBkOGMwYzA0ZDYzNmM1NzAzNDY1ZjEzOTM

[MyParcel Delivery Options]: #myparcel-delivery-options
[Introduction]: #introduction
[Browser support]: #browser-support
[Installation]: #installation
[Usage]: #usage
[Minimum required data]: #minimum-required-data
[All options]: #all-options
[Examples]: #examples
[Getting the address from your environment]: #getting-the-address-from-your-environment
[Usage in forms]: #usage-in-forms
[Contribute]: #contribute
[Support]: #support
