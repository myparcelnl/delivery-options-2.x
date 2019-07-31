# MyParcel Checkout

[![Build Status](https://travis-ci.com/myparcelbe/checkout.svg?branch=master)](https://travis-ci.com/myparcelbe/checkout)

- [Installation](#installation)
- [Requirements](#requirements)
- [Example](#example)
- [Usage](#usage)

---

### Installation

You can download the zip on the projects [releases](https://github.com/myparcelbe/checkout/releases) page.

1. Download the package zip.
2. Unzip the contents of the zip file.
3. Require the js/myparcel.js and add the css/myparcel.css files in your project. 
4. Get the HTML content of the examples / an example file and place it inside your project.  


### Requirements
- [Node](https://nodejs.org)

### Example
An example of the checkout functionality can be found via our [Sandbox](https://myparcelbe.github.io/checkout/sandbox/) example.


### Usage
Make sure that the myparcel.js is loaded before the initialize function.

Inside the data you have to send the following code:
```js
var data = {
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

To initialize the checkout the init object should be constructed.

```MyParcel.init(data);```

When there is no title set for `deliveryMorningTitle`, `deliveryStandardTitle` or `deliveryEveningTitle` , the delivery time will automatically be visible.

To get the object with the selected option of the user do the following

```js
json = document.querySelector('#mypa-input').value;
obj = JSON.parse(json);
```

When you're experiencing trouble with the implementation we're ready to help you out! Please reach out to us via support@sendmyparcel.be or Slack us: 
