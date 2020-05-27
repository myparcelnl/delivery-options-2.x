export const KEY = 'config';

// Properties
export const API_BASE_URL = 'apiBaseUrl';
export const LOCALE = 'locale';
export const PLATFORM = 'platform';
export const CURRENCY = 'currency';

export const PACKAGE_TYPE = 'packageType';

export const ALLOW_DELIVERY_OPTIONS = 'allowDeliveryOptions';
export const ALLOW_EVENING_DELIVERY = 'allowEveningDelivery';
export const ALLOW_MORNING_DELIVERY = 'allowMorningDelivery';
export const ALLOW_ONLY_RECIPIENT = 'allowOnlyRecipient';
export const ALLOW_PICKUP_EXPRESS = 'allowPickupExpress';
export const ALLOW_PICKUP_LOCATIONS = 'allowPickupLocations';
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

/*
 * Package types
 */
export const ALLOW_PACKAGE_TYPE_DIGITAL_STAMP = 'allowPackageTypeDigitalStamp';
export const ALLOW_PACKAGE_TYPE_MAILBOX = 'allowPackageTypeMailbox';
export const PRICE_PACKAGE_TYPE_DIGITAL_STAMP = 'pricePackageTypeDigitalStamp';
export const PRICE_PACKAGE_TYPE_MAILBOX = 'pricePackageTypeMailbox';

/*
 * For use with Monday delivery.
 */
export const ALLOW_MONDAY_DELIVERY = 'allowMondayDelivery';
export const PRICE_MONDAY_DELIVERY = 'priceMondayDelivery';
export const SATURDAY_CUTOFF_TIME = 'saturdayCutoffTime';

/*
 * For use with Saturday delivery.
 */
export const ALLOW_SATURDAY_DELIVERY = 'allowSaturdayDelivery';
export const FRIDAY_CUTOFF_TIME = 'fridayCutoffTime';
export const PRICE_SATURDAY_DELIVERY = 'priceSaturdayDelivery';

/*
 * Carrier settings object
 */
export const CARRIER_SETTINGS = 'carrierSettings';

// Extra features

/*
 * Allow a retry modal to let the user re-enter their address on error.
 */
export const FEATURE_ALLOW_RETRY = 'allowRetry';

/*
 * The default view of pickup locations.
 */
export const FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW = 'pickupLocationsDefaultView';

/*
 * Show distance under each pickup location if true. Otherwise shows street name and number.
 */
export const FEATURE_PICKUP_SHOW_DISTANCE = 'pickupShowDistance';

/*
 * Tile layer data for use with the pickup locations map.
 */
export const PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA = 'pickupLocationsMapTileLayerData';

/*
 * Max amount of pickup locations shown.
 */
export const FEATURE_MAX_PAGE_ITEMS = 'maxPageItems';

/**
 * These settings can be overridden by the carrierSettings object in the config.
 *
 * @type {Array}
 */
export const settingsWithCarrierOverride = [
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PICKUP_EXPRESS,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SATURDAY_DELIVERY,
  ALLOW_SIGNATURE,
  PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
  PRICE_PACKAGE_TYPE_MAILBOX,
  PRICE_EVENING_DELIVERY,
  PRICE_MORNING_DELIVERY,
  PRICE_ONLY_RECIPIENT,
  PRICE_PICKUP,
  PRICE_PICKUP_EXPRESS,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
];
