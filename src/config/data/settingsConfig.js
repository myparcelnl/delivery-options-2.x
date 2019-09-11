// CONFIG
export const API_BASE_URL = 'apiBaseUrl';
export const CARRIERS = 'carriers';
export const LOCALE = 'locale';
export const PLATFORM = 'platform';
export const CURRENCY = 'currency';

export const ALLOW_DELIVERY_OPTIONS = 'allowDeliveryOptions';
export const ALLOW_EVENING_DELIVERY = 'allowEveningDelivery';
export const ALLOW_MONDAY_DELIVERY = 'allowMondayDelivery';
export const ALLOW_MORNING_DELIVERY = 'allowMorningDelivery';
export const ALLOW_ONLY_RECIPIENT = 'allowOnlyRecipient';
export const ALLOW_PICKUP_EXPRESS = 'allowPickupExpress';
export const ALLOW_PICKUP_LOCATIONS = 'allowPickupLocations';
export const ALLOW_SATURDAY_DELIVERY = 'allowSaturdayDelivery';
export const ALLOW_SIGNATURE = 'allowSignature';
export const CUTOFF_TIME = 'cutoffTime';
export const DELIVERY_DAYS_WINDOW = 'deliveryDaysWindow';
export const DROP_OFF_DAYS = 'dropOffDays';
export const DROP_OFF_DELAY = 'dropOffDelay';
export const PRICE_EVENING_DELIVERY = 'priceEveningDelivery';
export const PRICE_MORNING_DELIVERY = 'priceMorningDelivery';
export const PRICE_ONLY_RECIPIENT = 'priceOnlyRecipient';
export const PRICE_PICKUP = 'pricePickup';
export const PRICE_PICKUP_EXPRESS = 'pricePickupExpress';
export const PRICE_SIGNATURE = 'priceSignature';
export const PRICE_STANDARD_DELIVERY = 'priceStandardDelivery';
export const SATURDAY_CUTOFF_TIME = 'saturdayCutoffTime';

// Carrier settings object
export const CARRIER_SETTINGS = 'carrierSettings';

// Extra features
export const FEATURE_ALLOW_RETRY = 'allowRetry';
export const FEATURE_PICKUP_SHOW_DISTANCE = 'pickupShowDistance';
export const FEATURE_MAX_PAGE_ITEMS = 'maxPageItems';
export const FEATURE_USE_LEGACY = 'useLegacy';

// STRINGS
export const CITY = 'city';
export const POSTCODE = 'postcode';
export const HOUSE_NUMBER = 'houseNumber';
export const ADDRESS_NOT_FOUND = 'addressNotFound';

export const CLOSED = 'closed';
export const DISCOUNT = 'discount';
export const FREE = 'free';
export const FROM = 'from';
export const LOAD_MORE = 'loadMore';
export const RETRY = 'retry';
export const PICK_UP_FROM = 'pickUpFrom';
export const OPENING_HOURS = 'openingHours';

export const HEADER_DELIVERY_OPTIONS = 'headerDeliveryOptions';

export const DELIVERY_EVENING_TITLE = 'deliveryEveningTitle';
export const DELIVERY_MORNING_TITLE = 'deliveryMorningTitle';
export const DELIVERY_STANDARD_TITLE = 'deliveryStandardTitle';
export const DELIVERY_TITLE = 'deliveryTitle';
export const ONLY_RECIPIENT_TITLE = 'onlyRecipientTitle';
export const PICKUP_TITLE = 'pickupTitle';
export const SIGNATURE_TITLE = 'signatureTitle';

export const BE_DELIVERY_STANDARD_TITLE = 'beDeliveryStandardTitle';
export const BE_DELIVERY_TITLE = 'beDeliveryTitle';
export const SATURDAY_DELIVERY_TITLE = 'saturdayDeliveryTitle';
export const WRONG_HOUSE_NUMBER_POSTCODE = 'wrongHouseNumberPostcode';
export const WRONG_POSTAL_CODE_CITY = 'wrongPostalCodeCity';

/**
 * These settings can't be overridden by the carrierSettings object in the config.
 *
 * @type {Array}
 */
export const settingsWithoutCarrierOverride = [
  PLATFORM,
  CURRENCY,
  API_BASE_URL,
  CARRIERS,
  LOCALE,

  FEATURE_ALLOW_RETRY,
  FEATURE_PICKUP_SHOW_DISTANCE,
];
