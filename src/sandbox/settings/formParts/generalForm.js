import * as CONFIG from '@/data/keys/configKeys';
import * as CONSTS from '@/data/keys/settingsConsts';
import CCheckboxGroup from '@/sandbox/components/form/CCheckboxGroup';
import CNumber from '@/sandbox/components/form/CNumber';
import CTimepicker from '@/sandbox/components/form/CTimepicker';
import { getWeekdays } from '@/helpers/getWeekdays';
import { i18n } from '@/sandbox/services/vue-i18n';

const weekdays = getWeekdays(i18n.locale);

export const generalForm = [
  {
    key: CONFIG.KEY,
    name: CONFIG.CURRENCY,
  },
  {
    key: CONFIG.KEY,
    name: CONFIG.DROP_OFF_DAYS,
    component: CCheckboxGroup,
    props: {
      // Map the weekdays to options. If the day is sunday set index to 0.
      options: weekdays.map((day, index) => ({
        value: index === weekdays.length - 1 ? 0 : index + 1,
        text: day,
      })),
    },
  },
  {
    key: CONFIG.KEY,
    name: CONFIG.DROP_OFF_DELAY,
    component: CNumber,
    props: {
      min: CONSTS.DROP_OFF_DELAY_MIN,
      max: CONSTS.DROP_OFF_DELAY_MAX,
    },
  },
  {
    key: CONFIG.KEY,
    name: CONFIG.CUTOFF_TIME,
    component: CTimepicker,
  },
];
