export const fakeConfig = {
  config: {
    carriers: 'bpost,dpd',
    currency: 'EUR',

    cutoffTime: '17:00',
    deliveryDaysWindow: 1,
    dropOffDays: '1;2;3;4',
    dropOffDelay: 1,

    allowDeliveryOptions: 1,
    allowEveningDelivery: 0,
    allowMorningDelivery: 0,
    allowOnlyRecipient: 1,
    allowPickupExpress: 0,
    allowPickupPoints: 1,
    allowSignature: 1,

    priceEveningDelivery: 0,
    priceMorningDelivery: 0,
    priceOnlyRecipient: 0,
    pricePickup: 0,
    pricePickupExpress: 0,
    priceSignature: 0,
    priceStandardDelivery: 0,

    carrierSettings: {},
  },

  strings: {
    // Address strings
    city: 'Plaats',
    postcode: 'Postcode',
    houseNumber: 'Huisnummer',
    addressNotFound: 'Adresgegevens niet ingevuld',

    // Other strings
    again: 'Again',
    closed: 'Gesloten',
    discount: 'korting',
    free: 'Gratis',
    from: 'Vanaf',
    loadMore: 'Laad meer',
    retry: 'Opnieuw proberen',

    // Titles of options
    deliveryEveningTitle: 'Evening delivery',
    deliveryMorningTitle: 'Morning delivery',
    deliveryStandardTitle: '',
    deliveryTitle: 'Bezorgen op',
    onlyRecipientTitle: 'Home address only',
    pickUpFrom: 'Afhalen vanaf',
    pickupTitle: 'Afhalen op locatie',
    signatureTitle: 'Handtekening',
    openingHours: 'Openingstijden',
  },
};
