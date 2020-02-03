window.MyParcelConfig = {
  address: {
    cc: 'NL',
    postalCode: '2132WT',
    number: '66',
  },
  config: {
    carriers: ['postnl'],

    priceMorningDelivery: '2.50',
    priceStandardDelivery: '5.85',
    priceEveningDelivery: '1.25',
    priceSignature: '0.35',
    priceOnlyRecipient: '0.30',
    pricePickup: '5.85',

    deliveryTitle: 'Bezorgen op',
    pickupTitle: 'Afhalen op locatie',
    deliveryStandardTitle: 'Standaard levering',
    signatureTitle: 'Handtekening',

    allowSaturdayDelivery: true,
    allowSignature: true,
    allowPickupLocations: true,

    dropOffDays: '1;2;3;4;5;6',
    cutoffTime: '15:00',
    deliveryDaysWindow: 5,
    dropOffDelay: 1,
  },
};
