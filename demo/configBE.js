window.MyParcelConfig = {
  config: {
    platform: 'belgie',
    carriers: ['bpost', 'dpd'],

    // All settings below can be overridden per carrier via the carrierSettings property
    priceMorningDelivery: '10.00',
    priceStandardDelivery: '5.85',
    priceEveningDelivery: '1.25',
    priceSignature: '0.36',
    priceOnlyRecipient: '0.29',
    pricePickup: '5.85',

    // Delivery additional options
    allowSaturdayDelivery: true,
    allowSignature: true,
    allowPickupLocations: true,

    // Other settings
    dropOffDays: '1;2;3;4;5;6',
    cutoffTime: '15:00',
    deliveryDaysWindow: 4,
    dropOffDelay: 1,

    // Use this object to override above settings per carrier.
    carrierSettings: {
      bpost: {
        deliveryDaysWindow: 7,
      },
      dpd: {},
    },
  },
  strings: {
    deliveryTitle: 'Bezorgen op',
    pickupTitle: 'Afhalen op locatie',

    signatureTitle: 'Handtekening',
    wrongPostalCodeCity: 'Zaterdaglevering',
    saturdayDeliveryTitle: 'Combinatie postcode/plaats onbekend',
  },
  address: {
    cc: 'BE',
    city: 'Antwerpen',
    postalCode: '1000',
  },
};
