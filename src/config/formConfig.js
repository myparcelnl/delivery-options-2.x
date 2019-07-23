export const DELIVERY = 'delivery';

export const DELIVERY_DATE = 'deliveryDate';

export const DELIVERY_MOMENT = 'deliveryMoment';

export const DELIVERY_MORNING = 'morning';
export const DELIVERY_STANDARD = 'standard';
export const DELIVERY_EVENING = 'evening';

export const ADDITIONAL_OPTIONS = 'additionalOptions';

export const SIGNATURE = 'signature';
export const ONLY_RECIPIENT = 'only_recipient';

export const PICKUP = 'pickup';

export const PICKUP_STANDARD = 'pickup';
export const PICKUP_EXPRESS = 'pickup_express';

/**
 * Base form config.
 *
 * @type {Object}
 */
export const formConfig = {

  structure: {
    [DELIVERY]: {
      DELIVERY_DATE: 'deliveryDate',
      DELIVERY_MOMENT: 'deliveryMoment',
      ADDITIONAL_OPTIONS: 'additionalOptions',
    },
  },

  /**
   * Additional options.
   *
   * @see https://myparcelnl.github.io/api/#7_C
   */
  [ADDITIONAL_OPTIONS]: {
    name: ADDITIONAL_OPTIONS,
    options: {
      [SIGNATURE]: {
        enabled: 'allowSignature',
        label: 'signatureTitle',
        name: 'signature',
        price: 'priceSignature',
      },
      [ONLY_RECIPIENT]: {
        enabled: 'allowOnlyRecipient',
        label: 'onlyRecipientTitle',
        name: 'only_recipient',
        price: 'priceOnlyRecipient',
      },
    },
  },

  /**
   * Delivery moments.
   *
   * @see https://myparcelnl.github.io/api/#8
   */
  [DELIVERY]: {
    enabled: 'allowDeliveryOptions',
    name: 'delivery',
    options: {
      [DELIVERY_MORNING]: {
        enabled: 'allowMorningDelivery',
        label: 'deliveryMorningTitle',
        name: 'morning',
        price: 'priceMorningDelivery',
      },
      [DELIVERY_STANDARD]: {
        label: 'deliveryStandardTitle',
        name: 'standard',
        price: 'priceStandardDelivery',
        selected: true,
      },
      [DELIVERY_EVENING]: {
        enabled: 'allowEveningDelivery',
        label: 'deliveryEveningTitle',
        name: 'evening',
        price: 'priceEveningDelivery',
      },
    },
  },

  /**
   * Pickup settings
   */
  [PICKUP]: {
    enabled: 'allowPickupPoints',
    name: 'pickup',
    options: {
      [PICKUP_EXPRESS]: {
        enabled: 'allowPickupExpress',
        name: 'pickupExpress',
        price: 'pricePickupExpress',
      },
      [PICKUP_STANDARD]: {
        enabled: 'allowPickupPoints',
        name: 'pickupNormal',
        price: 'pricePickup',
        selected: true,
      },
    },
  },
};
