import * as CONFIG from '@/data/keys/configKeys';
import * as FORM from '@/config/formConfig';
import * as STRINGS from '@/data/keys/stringsKeys';
import { inAnyCarrier } from '@/sandbox/settings/conditions/inAnyCarrier';

export const stringsForm = [
  {
    title: FORM.DELIVERY,
    settings: [
      {
        key: STRINGS.KEY,
        name: STRINGS.HEADER_DELIVERY_OPTIONS,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.DELIVERY_TITLE,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        ],
      },
    ],
  },
  {
    title: FORM.PICKUP,
    settings: [
      {
        key: STRINGS.KEY,
        name: STRINGS.LOAD_MORE,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.PICKUP_LOCATIONS_LIST_BUTTON,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.PICKUP_LOCATIONS_MAP_BUTTON,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
    ],
  },
  {
    title: 'strings_other',
    settings: [
      {
        key: STRINGS.KEY,
        name: STRINGS.DISCOUNT,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.FROM,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.FREE,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.RETRY,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.ADDRESS_NOT_FOUND,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.CLOSED,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.WRONG_NUMBER_POSTAL_CODE,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.WRONG_POSTAL_CODE_CITY,
      },
    ],
  },
];
