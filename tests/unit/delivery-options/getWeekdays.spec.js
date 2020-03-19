import { getWeekdays } from '@/helpers/getWeekdays';
import { mockConfigBus } from './mockConfigBus';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';

let configBus;

describe('getWeekdays.js', () => {
  it('creates arrays of weekdays correctly per locale', () => {
    configBus = mockConfigBus(DEFAULT_PLATFORM);
    expect(configBus.get('locale')).toEqual('nl-NL');
    expect(getWeekdays()).toEqual([
      'Maandag',
      'Dinsdag',
      'Woensdag',
      'Donderdag',
      'Vrijdag',
      'Zaterdag',
      'Zondag',
    ]);

    configBus.$data.config.locale = 'en-GB';
    expect(getWeekdays()).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });
});
