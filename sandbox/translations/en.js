import * as FORM from '../../src/config/data/formConfig';
import * as SETTINGS from '../../src/config/data/settingsConfig';
import { GENERAL, STRINGS } from '../src/settings';

export default {
  en: {
    titles: {
      [FORM.ADDITIONAL_OPTIONS]: 'Additional Options',
      [FORM.DELIVERY]: 'Delivery',
      [FORM.DELIVERY_EVENING]: 'Evening delivery',
      [GENERAL]: 'General',
      [FORM.DELIVERY_MORNING]: 'Morning delivery',
      [FORM.ONLY_RECIPIENT]: 'Only Recipient',
      [FORM.PICKUP]: 'Pickup',
      [FORM.PICKUP_EXPRESS]: 'Pickup Express',
      [FORM.SIGNATURE]: 'Signature',
      [FORM.DELIVERY_STANDARD]: 'Standard delivery',
      [STRINGS]: 'Other strings',
    },

    settings: {
      [SETTINGS.CURRENCY]: {
        placeholder: 'EUR',
        description: 'The currency to display prices in. Default: <code>EUR</code>',
      },
      [SETTINGS.CUTOFF_TIME]: {
        default: '17:00',
        placeholder: '17:00',
        description: 'This option allows the merchant to indicate the latest cut-off time before an order will still be picked, packed and dispatched on the same/first set dropoff day, taking the dropoff delay into account. (Industry standard) default time is <code>17:00</code>. For example, if cutoff time is 17:00, Monday is a delivery day and there\'s no delivery delay; all orders placed Monday before 17:00 will be dropped of at PostNL on that same Monday in time for the Monday collection and delivery on Tuesday.',
      },
      [SETTINGS.DELIVERY_DAYS_WINDOW]: {
        placeholder: '',
        description: 'This option allows the Merchant to set the number of days into the future for which she wants to show her consumers delivery options. For example; If set to 3 (days) in her checkout, a consumer ordering on Monday will see possible delivery options for Tuesday, Wednesday and Thursday (provided there is no drop-off delay, it\'s before the cut-off time and she goes to PostNL on Mondays). Min. is 1 and max. is 14.',
      },
      [SETTINGS.DROP_OFF_DAYS]: {
        default: '1,2,3,4,5',
      },
      [SETTINGS.DROP_OFF_DELAY]: {
        placeholder: '',
        description: 'This option allows the merchant to set the number of days it takes her to pick, pack and hand in her parcel at PostNL when ordered before the cutoff time. By default this is 0 and max. is 14.',
      },
      [SETTINGS.CARRIERS]: {
        default: 'bpost,dpd',
      },
      [SETTINGS.ALLOW_DELIVERY_OPTIONS]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.ALLOW_EVENING_DELIVERY]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.ALLOW_MORNING_DELIVERY]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.ALLOW_ONLY_RECIPIENT]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.ALLOW_PICKUP_EXPRESS]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.ALLOW_PICKUP_POINTS]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.ALLOW_SIGNATURE]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.PRICE_EVENING_DELIVERY]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.PRICE_MORNING_DELIVERY]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.PRICE_ONLY_RECIPIENT]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.PRICE_PICKUP]: {
        description: 'It\'s possible to fill in a positive or negative amount. Would you like to give a discount for the use of this feature or would you like to calculate extra costs? If the amount is negative the price will appear green in the checkout.',
      },
      [SETTINGS.PRICE_PICKUP_EXPRESS]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.PRICE_SIGNATURE]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.PRICE_STANDARD_DELIVERY]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.CARRIER_SETTINGS]: {
        placeholder: '',
        description: '',
      },
      [SETTINGS.ALLOW_MONDAY_DELIVERY]: {
        description: 'Monday delivery is only possible when the package is delivered before 15.00 on Saturday at the designated PostNL locations. [SETTINGS.NOTE]: To activate Monday delivery value 6 must be given with dropOffDays and value 1 must be given by monday_delivery. On Saturday the cutoffTime must be before 15:00 (14:30 recommended) so that Monday will be shown. <a href="https://blog.myparcel.nl/maandagbezorging/" target="_blank">More information about this free service.</a>',
      },
      [SETTINGS.CITY]: {
        description: '',
        placeholder: 'Plaats',
      },
      [SETTINGS.POSTCODE]: {
        description: '',
        placeholder: 'Postcode',
      },
      [SETTINGS.HOUSE_NUMBER]: {
        description: '',
        placeholder: 'Huisnummer',
      },
      [SETTINGS.ADDRESS_NOT_FOUND]: {
        description: '',
        placeholder: 'Adresgegevens niet ingevuld',
      },

      // Other strings
      [SETTINGS.CLOSED]: {
        description: '',
        placeholder: 'Gesloten',
      },
      [SETTINGS.DISCOUNT]: {
        description: '',
        placeholder: 'korting',
      },
      [SETTINGS.FREE]: {
        description: '',
        placeholder: 'Gratis',
      },
      [SETTINGS.FROM]: {
        description: '',
        placeholder: 'Vanaf',
      },
      [SETTINGS.LOAD_MORE]: {
        description: '',
        placeholder: 'Laad meer',
      },
      [SETTINGS.RETRY]: {
        description: '',
        placeholder: 'Opnieuw proberen',
      },

      // Titles of options
      [SETTINGS.DELIVERY_EVENING_TITLE]: {
        description: 'When there is no title, the delivery time will automatically be visible.',
        placeholder: 'Evening delivery',
      },
      [SETTINGS.DELIVERY_MORNING_TITLE]: {
        description: 'When there is no title, the delivery time will automatically be visible.',
        placeholder: 'Morning delivery',
      },
      [SETTINGS.DELIVERY_STANDARD_TITLE]: {
        description: 'When there is no title, the delivery time will automatically be visible.',
      },
      [SETTINGS.DELIVERY_TITLE]: {
        description: '',
        placeholder: 'Deliver on',
      },
      [SETTINGS.ONLY_RECIPIENT_TITLE]: {
        description: '',
        placeholder: 'Home address only',
      },
      [SETTINGS.PICK_UP_FROM]: {
        description: '',
        placeholder: 'Afhalen vanaf',
      },
      [SETTINGS.PICKUP_TITLE]: {
        description: '',
        placeholder: 'Afhalen op locatie',
      },
      [SETTINGS.SIGNATURE_TITLE]: {
        description: '',
        placeholder: 'Handtekening',
      },

      // Opening hours and weekdays
      [SETTINGS.OPENING_HOURS]: {
        description: '',
        placeholder: 'Openingstijden',
      },
    },
  },
};

