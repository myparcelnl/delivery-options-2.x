import * as STRINGS from '@/data/keys/stringsKeys';

/**
 * Get the default strings.
 *
 * @returns {MyParcelDeliveryOptions.Strings}
 */
export const getDefaultStrings = () => ({
  // Address strings
  [STRINGS.CITY]: 'Plaats',
  [STRINGS.POSTAL_CODE]: 'Postcode',
  [STRINGS.NUMBER]: 'Huisnummer',
  [STRINGS.ADDRESS_NOT_FOUND]: 'Adresgegevens niet ingevuld',

  // Other strings
  [STRINGS.CLOSED]: 'Gesloten',
  [STRINGS.FREE]: 'Gratis',
  [STRINGS.FROM]: 'Vanaf',
  [STRINGS.LOAD_MORE]: 'Laad meer',
  [STRINGS.RETRY]: 'Opnieuw',

  // Main header
  [STRINGS.HEADER_DELIVERY_OPTIONS]: '',

  // Title of options
  [STRINGS.DELIVERY_EVENING_TITLE]: '',
  [STRINGS.DELIVERY_MORNING_TITLE]: '',
  [STRINGS.DELIVERY_STANDARD_TITLE]: '',
  [STRINGS.DELIVERY_TITLE]: 'Thuis of op het werk bezorgen',
  [STRINGS.ONLY_RECIPIENT_TITLE]: 'Alleen ontvanger',
  [STRINGS.PICK_UP_FROM]: 'Afhalen vanaf',
  [STRINGS.PICKUP_TITLE]: 'Afhalen op locatie',
  [STRINGS.SIGNATURE_TITLE]: 'Handtekening voor ontvangst',

  // Opening hours
  [STRINGS.OPENING_HOURS]: 'Openingstijden',
  [STRINGS.OPTIONS]: 'Opties',

  [STRINGS.PICKUP_LOCATIONS_LIST_BUTTON]: 'Lijst',
  [STRINGS.PICKUP_LOCATIONS_MAP_BUTTON]: 'Kaart',

  [STRINGS.PACKAGE_TYPE_DIGITAL_STAMP]: 'Digitale postzegel',
  [STRINGS.PACKAGE_TYPE_MAILBOX]: 'Brievenbuspakje',
});
