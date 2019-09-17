/* eslint-disable no-magic-numbers */
import * as FORM from '@/config/data/formConfig';
import * as SETTINGS from '../../src/config/data/settingsConfig';

export const CONFIG = 'config';
export const GENERAL = 'general';
export const SETTING = 'setting';
export const STRINGS = 'strings';

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

/**
 * Settings and their default values.
 *
 * @type {*[]}
 */
export const settings = [
  {
    title: GENERAL,
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
        value: '16:00',
      },
    ],
  },
  {
    title: FORM.DELIVERY,
    settings: [
      {
        name: SETTINGS.DELIVERY_TITLE,
        value: 'Bezorgen op',
      },
      {
        title: FORM.DELIVERY_MORNING,
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
        title: FORM.DELIVERY_STANDARD,
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
        title: FORM.DELIVERY_EVENING,
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
        title: FORM.SHIPMENT_OPTIONS,
        settings: [
          {
            title: FORM.ONLY_RECIPIENT,
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
            title: FORM.SIGNATURE,
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
    title: FORM.PICKUP,
    settings: [
      {
        name: SETTINGS.ALLOW_PICKUP_LOCATIONS,
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
    title: FORM.PICKUP_EXPRESS,
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
    title: STRINGS,
    settings: [
      {
        name: SETTINGS.CLOSED,
        value: 'Bezorgen op',
      },
    ],
  },
];
