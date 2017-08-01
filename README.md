This software serves as an example to the uses of the MyParcel delivery end-points. This is a example checkout for webshops.

### Examples

[Normal version](https://myparcelnl.github.io/checkout/)

## Usage

Make sure all included javascript libaries are loaded before the `myparcel.js` is loaded.

To configure the checkout the following object need to be set:

```javascript
window.mypa.settings = {
	cc: 'NL', // String - Values: "NL"(Default) or "BE"
	number: '100', // String - Required
	street: 'Street name', // String - Required
	postal_code: '1111AA', // String - Required
	price: {
		morning: '&#8364; 12,00', // String - Make sure too add the currency in proper format
		default: '&#8364; 12,00', // String
		night: '&#8364; 12,00', // String
		pickup: '&#8364; 12,00', // String
		pickup_express: '&#8364; 12,00', // String
		signed: '&#8364; 12,00', // String
		only_recipient: '&#8364; 12,00', // String
		combi_options: '&#8364; 12,00', // String
	},
	text: {
		signed: 'Text to show instead of default text',
		only_recipient: 'Text to show instead of default text'
	}
};
```

To initialize the checkout the myparcel object should be constructed

```js
myparcel = new MyParcel();
```

To get the object with the selected option of the user do the following

```js
json = $('#mypa-input').val();
obj = JSON.parse(json);
```

This configuration can be changed after the checkout has loaded. The config need to be reloaded after is has changed. This can be done using the `updatePage` function.

Not all fields are required for the checkout to function.

For the `signed` and `only_recipient` option if disabled is given as string the option wont shown.
