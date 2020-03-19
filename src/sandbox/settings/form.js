import * as CONFIG from '@/data/keys/configKeys';
import * as FORM from '@/config/formConfig';
import * as STRINGS from '@/data/keys/stringsKeys';
import CCurrency from '@/sandbox/components/form/CCurrency';
import CTimepicker from '@/sandbox/components/form/CTimepicker';
import CToggle from '@/sandbox/components/form/CToggle';
import { GENERAL } from '@/sandbox/settings';
import { allowedInAnyCarrier } from '@/sandbox/settings/conditions/allowedInAnyCarrier';
import { carrierSetting } from '@/sandbox/settings/carrierSetting';
import { featuresForm } from '@/sandbox/settings/formParts/featuresForm';
import { generalForm } from '@/sandbox/settings/formParts/generalForm';
import { inAnyCarrier } from '@/sandbox/settings/conditions/inAnyCarrier';
import memoize from 'lodash-es/memoize';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';
import { stringsForm } from '@/sandbox/settings/formParts/stringForm';

const currencyProps = {
  symbol: sandboxConfigBus.getSetting(CONFIG.KEY, CONFIG.CURRENCY) || '€',
};

/**
 * Settings and their default values.
 *
 * @param {MyParcel.Platform} platform - Platform to get settings for.
 *
 * @returns {Array}
 */
// eslint-disable-next-line max-lines-per-function
export const createSettings = memoize((platform) => {
  const perCarrier = (data) => carrierSetting(data, platform);
  const ifAnyCarrierHas = (setting, data) => allowedInAnyCarrier(setting, data, platform);

  return [
    {
      title: GENERAL,
      description: 'general',
      settings: generalForm,
    },
    {
      title: FORM.DELIVERY,
      settings: [
        ...perCarrier({
          name: CONFIG.ALLOW_DELIVERY_OPTIONS,
          component: CToggle,
        }),
        {
          title: FORM.DELIVERY_STANDARD,
          settings: [
            {
              key: STRINGS.KEY,
              name: STRINGS.DELIVERY_STANDARD_TITLE,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
              ],
            },
            {
              key: CONFIG.KEY,
              name: CONFIG.PRICE_STANDARD_DELIVERY,
              component: CCurrency,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
              ],
              props: currencyProps,
            },
          ],
        },
        ...ifAnyCarrierHas(CONFIG.ALLOW_MORNING_DELIVERY, {
          title: FORM.DELIVERY_MORNING,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_MORNING_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: STRINGS.KEY,
              name: STRINGS.DELIVERY_MORNING_TITLE,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_MORNING_DELIVERY),
              ],
            },
            {
              key: CONFIG.KEY,
              name: CONFIG.PRICE_MORNING_DELIVERY,
              component: CCurrency,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_MORNING_DELIVERY),
              ],
              props: currencyProps,
            },
          ],
        }),
        ...ifAnyCarrierHas(CONFIG.ALLOW_EVENING_DELIVERY, {
          title: FORM.DELIVERY_EVENING,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_EVENING_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: STRINGS.KEY,
              name: STRINGS.DELIVERY_EVENING_TITLE,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_EVENING_DELIVERY),
              ],
            },
            {
              key: CONFIG.KEY,
              name: CONFIG.PRICE_EVENING_DELIVERY,
              component: CCurrency,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_EVENING_DELIVERY),
              ],
              props: currencyProps,
            },
          ],
        }),
        ...ifAnyCarrierHas(CONFIG.ALLOW_MONDAY_DELIVERY, {
          title: FORM.MONDAY_DELIVERY,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_MONDAY_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: CONFIG.KEY,
              name: CONFIG.SATURDAY_CUTOFF_TIME,
              component: CTimepicker,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_MONDAY_DELIVERY),
              ],
            },
          ],
        }),

        ...ifAnyCarrierHas(CONFIG.ALLOW_SATURDAY_DELIVERY, {
          title: FORM.SATURDAY_DELIVERY,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_SATURDAY_DELIVERY,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_DELIVERY_OPTIONS,
              ],
            }),
            {
              key: CONFIG.KEY,
              name: CONFIG.FRIDAY_CUTOFF_TIME,
              component: CTimepicker,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
                inAnyCarrier(CONFIG.ALLOW_SATURDAY_DELIVERY),
              ],
            },
          ],
        }),
        {
          title: FORM.SHIPMENT_OPTIONS,
          settings: [
            ...ifAnyCarrierHas(CONFIG.ALLOW_ONLY_RECIPIENT, {
              title: FORM.ONLY_RECIPIENT,
              settings: [
                ...perCarrier({
                  name: CONFIG.ALLOW_ONLY_RECIPIENT,
                  component: CToggle,
                  conditions: [
                    CONFIG.ALLOW_DELIVERY_OPTIONS,
                  ],
                }),
                {
                  key: STRINGS.KEY,
                  name: STRINGS.ONLY_RECIPIENT_TITLE,
                  conditions: [
                    inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT),
                  ],
                },
                {
                  key: CONFIG.KEY,
                  name: CONFIG.PRICE_ONLY_RECIPIENT,
                  component: CCurrency,
                  props: currencyProps,
                  conditions: [
                    inAnyCarrier(CONFIG.ALLOW_ONLY_RECIPIENT),
                  ],
                },
              ],
            }),
            ...ifAnyCarrierHas(CONFIG.ALLOW_SIGNATURE, {
              title: FORM.SIGNATURE,
              settings: [
                ...perCarrier({
                  name: CONFIG.ALLOW_SIGNATURE,
                  component: CToggle,
                  conditions: [
                    CONFIG.ALLOW_DELIVERY_OPTIONS,
                  ],
                }),
                {
                  key: STRINGS.KEY,
                  name: STRINGS.SIGNATURE_TITLE,
                  conditions: [
                    inAnyCarrier(CONFIG.ALLOW_SIGNATURE),
                  ],
                },
                {
                  key: CONFIG.KEY,
                  name: CONFIG.PRICE_SIGNATURE,
                  component: CCurrency,
                  props: currencyProps,
                  conditions: [
                    inAnyCarrier(CONFIG.ALLOW_SIGNATURE),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    },
    {
      title: FORM.PICKUP,
      settings: [
        ...perCarrier({
          name: CONFIG.ALLOW_PICKUP_LOCATIONS,
          component: CToggle,
        }),
        {
          key: STRINGS.KEY,
          name: STRINGS.PICKUP_TITLE,
          conditions: [
            inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
          ],
        },
        {
          key: CONFIG.KEY,
          name: CONFIG.PRICE_PICKUP,
          component: CCurrency,
          props: currencyProps,
          conditions: [
            inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
          ],
        },
        ...ifAnyCarrierHas(CONFIG.ALLOW_PICKUP_EXPRESS, {
          title: FORM.PICKUP_EXPRESS,
          settings: [
            ...perCarrier({
              name: CONFIG.ALLOW_PICKUP_EXPRESS,
              component: CToggle,
              conditions: [
                CONFIG.ALLOW_PICKUP_LOCATIONS,
              ],
            }),
            {
              key: CONFIG.KEY,
              name: CONFIG.PRICE_PICKUP_EXPRESS,
              component: CCurrency,
              props: currencyProps,
              conditions: [
                inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
                inAnyCarrier(CONFIG.ALLOW_PICKUP_EXPRESS),
              ],
            },
          ],
        }),
      ],
    },
    {
      title: 'features',
      description: 'features',
      settings: featuresForm,
    },
    {
      title: STRINGS.KEY,
      settings: stringsForm,
    },
  ];
});
