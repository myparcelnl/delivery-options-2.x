/* eslint-disable no-magic-numbers */
// import { ADDITIONAL_OPTIONS, ONLY_RECIPIENT, PICKUP, PICKUP_EXPRESS, SIGNATURE } from '../../src/config/formConfig';
import * as SETTINGS from '../../src/config/settingsConfig';

export const CONFIG = 'config';
export const STRINGS = 'strings';
export const SETTING = 'setting';

const trueFalseOptions = [
  {
    label: 'Enabled',
    value: true,
  },
  {
    label: 'Disabled',
    value: false,
  },
];

export const settings = [
  {
    title: 'general',
    description: 'general',
    settings: [
      {
        name: SETTINGS.DROP_OFF_DAYS,
        value: '1,2,3,4,5',
      },
      {
        name: SETTINGS.CURRENCY,
        value: 'EUR',
      },
      {
        name: SETTINGS.CARRIERS,
        value: 'bpost,dpd',
      },
      {
        name: SETTINGS.CUTOFF_TIME,
        value: 'bpost,dpd',
      },
    ],
  },
  {
    title: 'delivery',
    settings: [
      {
        name: SETTINGS.DELIVERY_TITLE,
        value: 'Bezorgen op',
      },
      {
        title: 'morningDelivery',
        settings: [
          {
            name: SETTINGS.ALLOW_MORNING_DELIVERY,
            type: 'select',
            options: trueFalseOptions,
          },
          {
            name: SETTINGS.DELIVERY_MORNING_TITLE,
            value: 'Ochtendlevering',
          },
          {
            name: SETTINGS.PRICE_MORNING_DELIVERY,
            value: 2.49,
          },
        ],
      },
      {
        title: 'standardDelivery',
        settings: [
          {
            name: SETTINGS.DELIVERY_STANDARD_TITLE,
            value: true,
          },
          {
            name: SETTINGS.PRICE_STANDARD_DELIVERY,
            value: 2.49,
          },
        ],
      },
      {
        title: 'eveningDelivery',
        settings: [
          {
            name: SETTINGS.ALLOW_EVENING_DELIVERY,
            type: 'select',
            options: trueFalseOptions,
          },
          {
            name: SETTINGS.DELIVERY_EVENING_TITLE,
            value: 'Avondlevering',
          },
          {
            name: SETTINGS.PRICE_EVENING_DELIVERY,
            value: 2.49,
          },
        ],
      },
      {
        title: 'additionalOptions',
        settings: [
          {
            title: 'onlyRecipient',
            settings: [
              {
                name: SETTINGS.ALLOW_ONLY_RECIPIENT,
                type: 'select',
                options: trueFalseOptions,
              },
              {
                name: SETTINGS.ONLY_RECIPIENT_TITLE,
                value: 'Alleen geadresseerde',
              },
              {
                name: SETTINGS.PRICE_ONLY_RECIPIENT,
                value: 0.55,
              },
            ],
          },
          {
            title: 'signature',
            settings: [
              {
                name: SETTINGS.ALLOW_SIGNATURE,
                type: 'select',
                options: trueFalseOptions,
              },
              {
                name: SETTINGS.SIGNATURE_TITLE,
                value: 'Alleen geadresseerde',
              },
              {
                name: SETTINGS.PRICE_SIGNATURE,
                value: 0.55,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'pickup',
    settings: [
      {
        name: SETTINGS.ALLOW_PICKUP_POINTS,
        type: 'select',
        options: trueFalseOptions,
      },
      {
        name: SETTINGS.PICKUP_TITLE,
        value: 'Alleen geadresseerde',
      },
      {
        name: SETTINGS.PRICE_PICKUP,
        value: 0.55,
      },
    ],
  },
  {
    title: 'pickupExpress',
    settings: [
      {
        name: SETTINGS.ALLOW_PICKUP_EXPRESS,
        type: 'select',
        options: trueFalseOptions,
      },
      {
        name: SETTINGS.PRICE_PICKUP_EXPRESS,
        value: 0.55,
      },
    ],
  },
  {
    title: 'strings',
    settings: [
      {
        name: SETTINGS.CLOSED,
        value: 'Bezorgen op',
      },
    ],
  },
];
