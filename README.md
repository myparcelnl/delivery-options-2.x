# MyParcel Checkout


- [Installation](#installation)
- [Requirements](#requirements)
- [Example](#example)
- [Usage](#usage)

---
Please, star this repository if you use this repository. :star:

### Installation

You can download the zip on the projects [releases](https://github.com/myparcelnl/checkout/releases) page.

1. Download the package zip.
2. Unzip the contents of the zip file.
3. Require the js/myparcel.js and add the css/myparcel.css files to your project. 
4. Get the HTML content of the examples / an example file and place it inside your project.  


### Requirements

The MyParcel checkout works with jQuery  1.x, 2.x en 3.x

### Example
An example of the checkout functionality can be found via our [Sandbox](https://myparcelnl.github.io/checkout/sandbox/) example.


### Usage
Make sure that the myparcel.js is loaded before the initialize function.

Inside the data you have to send the following code:
```
var data = {
    address: {
        cc: 'NL',
        postalCode: '2131 BC',
        number: '679',
        city:'Hoofddorp'
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
    translateENtoNL: {
        'monday': 'maandag',
        'tuesday': 'dindsag',
        'wednesday': 'woensdag',
        'thursday': 'donderdag',
        'friday': 'vrijdag',
        'saturday': 'zaterdag',
        'sunday': 'zondag'
    },
    config: {
        "apiBaseUrl": "https://api.sendmyparcel.be/",
        "carrier": "1",
    
        "priceMorningDelivery": "10.00",
        "priceStandardDelivery": "5.85",
        "priceEveningDelivery": "1.25",
        "priceSignature": "0.36",
        "priceOnlyRecipient":"0.29",
        "pricePickup": "5.85",
        "pricePickupExpress": "1.38",
    
        "deliveryTitle":"Bezorgen op",
        "pickupTitle":"Afhalen op locatie",
        "deliveryMorningTitle":"Ochtendlevering",
        "deliveryStandardTitle":"Standaard levering",
        "deliveryEveningTitle":"Avondlevering",
        "signatureTitle": "Handtekening",
        "onlyRecipientTitle": "Alleen geadresseerde",
    
        "allowMondayDelivery": true,
        "allowMorningDelivery": true,
        "allowEveningDelivery": true,
        "allowSignature": true,
        "allowOnlyRecipient": true,
        "allowPickupPoints": true,
        "allowPickupExpress": true,
    
        "dropOffDays": "1;2;3;4;5;6",
        "saturdayCutoffTime": "16:00",
        "cutoffTime": "15:00",
        "deliverydaysWindow": "5",
        "dropoffDelay":"1"
    }
 };
```
The above values of the array are configurable. As soon as a value chages it will be visible in the checkout.

To initialize the checkout the init object should be constructed.

```MyParcel.init(data);```

When there is no title at ```deliveryMorningTitle```, ```deliveryStandardTitle``` or ```deliveryEveningTitle``` , the delivery time will automatically be visible.

To get the object with the selected option of the user do the following

```
json = $('#mypa-input').val();
obj = JSON.parse(json);
```

When you're experiencing trouble with the implementation we're ready to help you out! Please reach out to us via support@myparcel.nl
