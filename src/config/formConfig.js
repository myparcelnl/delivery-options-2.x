import * as SETTINGS from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';

export const DELIVERY = 'delivery';

// Delivery > Deliver
export const DELIVER = 'deliver';

// Delivery > Deliver > Carrier
// (Also used for pickup carrier)
export const CARRIER = 'carrier';

// Delivery > Deliver (> Carrier) > Delivery date
export const DELIVERY_DATE = 'deliveryDate';

// Delivery > Deliver (> Carrier) > Delivery moment
export const DELIVERY_MOMENT = 'deliveryMoment';

// Delivery > Deliver (> Carrier) > Delivery moment = morning | standard | evening
export const DELIVERY_MORNING = 'morning';
export const DELIVERY_STANDARD = 'standard';
export const DELIVERY_EVENING = 'evening';

// Delivery > Deliver (> Carrier) > Delivery moment > Shipment options
export const SHIPMENT_OPTIONS = 'shipmentOptions';

// Delivery > Deliver (> Carrier) > Delivery moment > Shipment options = [signature?, only_recipient?]
export const SIGNATURE = 'signature';
export const ONLY_RECIPIENT = 'only_recipient';

// Delivery > Pickup
export const PICKUP = 'pickup';

// Delivery > Pickup (> Pickup location)
export const PICKUP_LOCATION = 'pickupLocation';

// Delivery > Pickup (> Pickup location) > Pickup moment
export const PICKUP_MOMENT = 'pickupMoment';

// Delivery > Pickup (> Pickup location) > Pickup moment = standard | express
export const PICKUP_STANDARD = 'pickup';
export const PICKUP_EXPRESS = 'pickup_express';

/*
 * The following properties are only added to configBus.exportValues and not used internally.
 */
export const DATE = 'date';
export const IS_PICKUP = 'isPickup';
export const DELIVERY_TYPE = 'deliveryType';

export const MONDAY_DELIVERY = 'monday';
export const SATURDAY_DELIVERY = 'saturday';

/**
 * Base form config.
 *
 * @type {Object}
 */
export const formConfig = {

  /**
   * Delivery options.
   *
   * @see https://myparcelnl.github.io/api/#8
   */
  [DELIVERY]: {
    enabled: SETTINGS.ALLOW_DELIVERY_OPTIONS,
    name: DELIVERY,
    options: {
      [DELIVERY_MORNING]: {
        enabled: SETTINGS.ALLOW_MORNING_DELIVERY,
        label: STRINGS.DELIVERY_MORNING_TITLE,
        name: DELIVERY_MORNING,
        price: SETTINGS.PRICE_MORNING_DELIVERY,
      },
      [DELIVERY_STANDARD]: {
        label: STRINGS.DELIVERY_STANDARD_TITLE,
        name: DELIVERY_STANDARD,
        price: SETTINGS.PRICE_STANDARD_DELIVERY,
        selected: true,
      },
      [DELIVERY_EVENING]: {
        enabled: SETTINGS.ALLOW_EVENING_DELIVERY,
        label: STRINGS.DELIVERY_EVENING_TITLE,
        name: DELIVERY_EVENING,
        price: SETTINGS.PRICE_EVENING_DELIVERY,
      },
    },
  },

  /**
   * Shipment options for delivery.
   *
   * @see https://myparcelnl.github.io/api/#7_C
   */
  [SHIPMENT_OPTIONS]: {
    name: SHIPMENT_OPTIONS,
    options: {
      [SIGNATURE]: {
        enabled: SETTINGS.ALLOW_SIGNATURE,
        label: STRINGS.SIGNATURE_TITLE,
        name: SIGNATURE,
        price: SETTINGS.PRICE_SIGNATURE,
      },
      [ONLY_RECIPIENT]: {
        enabled: SETTINGS.ALLOW_ONLY_RECIPIENT,
        label: STRINGS.ONLY_RECIPIENT_TITLE,
        name: ONLY_RECIPIENT,
        price: SETTINGS.PRICE_ONLY_RECIPIENT,
      },
    },
  },

  /**
   * Pickup locations.
   */
  [PICKUP]: {
    enabled: SETTINGS.ALLOW_PICKUP_LOCATIONS,
    name: PICKUP,
    options: {
      [PICKUP_EXPRESS]: {
        enabled: SETTINGS.ALLOW_PICKUP_EXPRESS,
        name: PICKUP_EXPRESS,
        price: SETTINGS.PRICE_PICKUP_EXPRESS,
      },
      [PICKUP_STANDARD]: {
        enabled: SETTINGS.ALLOW_PICKUP_LOCATIONS,
        name: PICKUP_STANDARD,
        price: SETTINGS.PRICE_PICKUP,
        selected: true,
      },
    },
  },
};
