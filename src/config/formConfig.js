import * as SETTINGS from '@/config/settingsConfig';

export const DELIVERY = 'delivery';

// Delivery > Deliver
export const DELIVER = 'deliver';

// Delivery > Deliver > Carrier
export const DELIVERY_CARRIER = 'deliveryCarrier';

// Delivery > Deliver (> Carrier) > Delivery date
export const DELIVERY_DATE = 'deliveryDate';

// Delivery > Deliver (> Carrier) > Delivery moment
export const DELIVERY_MOMENT = 'deliveryMoment';

// Delivery > Deliver (> Carrier) > Delivery moment = morning | standard | evening
export const DELIVERY_MORNING = 'morning';
export const DELIVERY_STANDARD = 'standard';
export const DELIVERY_EVENING = 'evening';

// Delivery > Deliver (> Carrier) > Delivery moment > Additional options
export const ADDITIONAL_OPTIONS = 'additionalOptions';

// Delivery > Deliver (> Carrier) > Delivery moment > Additional options = [signature?, only_recipient?]
export const SIGNATURE = 'signature';
export const ONLY_RECIPIENT = 'only_recipient';

// Delivery > Pickup
export const PICKUP = 'pickup';

// Delivery > Pickup > Pickup standard
export const PICKUP_STANDARD = 'pickup';

// Delivery > Pickup > Pickup express
export const PICKUP_EXPRESS = 'pickup_express';

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
  [ADDITIONAL_OPTIONS]: {
    name: ADDITIONAL_OPTIONS,
    options: {
      [SIGNATURE]: {
        enabled: SETTINGS.ALLOW_SIGNATURE,
        label: SETTINGS.SIGNATURE_TITLE,
        name: SIGNATURE,
        price: SETTINGS.PRICE_SIGNATURE,
      },
      [ONLY_RECIPIENT]: {
        enabled: SETTINGS.ALLOW_ONLY_RECIPIENT,
        label: SETTINGS.ONLY_RECIPIENT_TITLE,
        name: ONLY_RECIPIENT,
        price: SETTINGS.PRICE_ONLY_RECIPIENT,
      },
    },
  },

  /**
   * Delivery moments.
   *
   * @see https://myparcelnl.github.io/api/#8
   */
  [DELIVERY]: {
    enabled: SETTINGS.ALLOW_DELIVERY_OPTIONS,
    name: DELIVERY,
    options: {
      [DELIVERY_MORNING]: {
        enabled: SETTINGS.ALLOW_MORNING_DELIVERY,
        label: SETTINGS.DELIVERY_MORNING_TITLE,
        name: DELIVERY_MORNING,
        price: SETTINGS.PRICE_MORNING_DELIVERY,
      },
      [DELIVERY_STANDARD]: {
        label: SETTINGS.DELIVERY_STANDARD_TITLE,
        name: DELIVERY_STANDARD,
        price: SETTINGS.PRICE_STANDARD_DELIVERY,
        selected: true,
      },
      [DELIVERY_EVENING]: {
        enabled: SETTINGS.ALLOW_EVENING_DELIVERY,
        label: SETTINGS.DELIVERY_EVENING_TITLE,
        name: DELIVERY_EVENING,
        price: SETTINGS.PRICE_EVENING_DELIVERY,
      },
    },
  },

  /**
   * Pickup settings.
   */
  [PICKUP]: {
    enabled: SETTINGS.ALLOW_PICKUP_POINTS,
    name: PICKUP,
    options: {
      [PICKUP_EXPRESS]: {
        enabled: SETTINGS.ALLOW_PICKUP_EXPRESS,
        name: PICKUP_EXPRESS,
        price: SETTINGS.PRICE_PICKUP_EXPRESS,
      },
      [PICKUP_STANDARD]: {
        enabled: SETTINGS.ALLOW_PICKUP_POINTS,
        name: PICKUP_STANDARD,
        price: SETTINGS.PRICE_PICKUP,
        selected: true,
      },
    },
  },
};
