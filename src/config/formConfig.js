export const CARRIER_POSTNL = 1;
export const CARRIER_BPOST = 2;
export const CARRIER_DPD = 3;

export const DELIVERY_MORNING = 1;
export const DELIVERY_STANDARD = 2;
export const DELIVERY_EVENING = 3;

export const DELIVERY_PICKUP_STANDARD = 4;
export const DELIVERY_PICKUP_EXPRESS = 5;

/**
 * Base form config.
 *
 * @type {Object}
 */
export const formConfig = {

  /**
   * Additional options.
   *
   * @see https://myparcelnl.github.io/api/#7_C
   */
  additionalOptions: {
    signature: {
      enabled: 'allowSignature',
      name: 'signature',
      label: 'signatureTitle',
      price: 'priceSignature',
    },
    onlyRecipient: {
      enabled: 'allowOnlyRecipient',
      name: 'onlyRecipient',
      label: 'onlyRecipientTitle',
      price: 'priceOnlyRecipient',
    },
  },

  /**
   * Map carrier ids to names and labels.
   *
   * @see https://myparcelnl.github.io/api/#carrier
   */
  carriers: {
    [CARRIER_POSTNL]: {
      name: 'postnl',
      label: 'carrierPostnlTitle',
      image: 'https://assets.myparcel.nl/skin/general-images/carrier-logos/svg/postnl.svg',
    },
    [CARRIER_BPOST]: {
      name: 'bpost',
      label: 'carrierBpostTitle',
      image: 'https://assets.myparcel.nl/skin/general-images/carrier-logos/svg/bpost.svg',
    },
    [CARRIER_DPD]: {
      name: 'dpd',
      label: 'carrierDpdTitle',
      image: 'https://assets.myparcel.nl/skin/general-images/carrier-logos/svg/dpd.svg',
    },
  },

  /**
   * Delivery moments.
   *
   * @see https://myparcelnl.github.io/api/#8
   */
  delivery: {
    [DELIVERY_MORNING]: {
      enabled: 'allowMorningDelivery',
      name: 'morning',
      label: 'deliveryMorningTitle',
      price: 'priceMorningDelivery',
    },
    [DELIVERY_STANDARD]: {
      name: 'normal',
      label: 'deliveryStandardTitle',
      price: 'priceNormalDelivery',
      selected: true,
    },
    [DELIVERY_EVENING]: {
      enabled: 'allowEveningDelivery',
      name: 'evening',
      label: 'deliveryEveningTitle',
      price: 'priceEveningDelivery',
    },
  },

  pickup: {
    [DELIVERY_PICKUP_STANDARD]: {
      enabled: 'allowPickupPoints',
      name: 'pickupNormal',
      price: 'pricePickup',
      selected: true,
    },
    [DELIVERY_PICKUP_EXPRESS]: {
      enabled: 'allowPickupExpress',
      name: 'pickupExpress',
      price: 'pricePickupExpress',
    },
  },
};
