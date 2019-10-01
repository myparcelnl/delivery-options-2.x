import { createConfigBus } from '@/config/configBus';
import { createIsoString } from '@/data/dates/createIsoString';
import { createLocaleString } from '@/data/dates/createLocaleString';

// Initialize the configBus
createConfigBus();

describe('date formatting', () => {
  it('displays dates and times correctly', () => {
    const date1 = '2019-10-15 00:00:00.000000';

    // The spaces in the expected strings are non-breaking spaces.
    expect(createLocaleString(date1)).toBe('00:00');
    expect(createIsoString(date1)).toBe('2019-10-15T00:00:00.000Z');

    const date2 = '2019-10-21 17:00:00.000000';

    // The spaces in the expected strings are non-breaking spaces.
    expect(createLocaleString(date2)).toBe('17:00');
    expect(createIsoString(date2)).toBe('2019-10-21T17:00:00.000Z');

    const date3 = '2022-11-22 09:32:10.000000';

    // The spaces in the expected strings are non-breaking spaces.
    expect(createLocaleString(date3, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })).toBe('22-11-2022 09:32:10');
    expect(createIsoString(date3)).toBe('2022-11-22T09:32:10.000Z');
  });
});
