import { MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { fetchDeliveryOptions } from '@/data/delivery/fetchDeliveryOptions';
import { fetchPickupLocations } from '@/data/pickup/fetchPickupLocations';
import { getConfigBus } from './testConfig';

const addresses = {
  be_invalid_cc: { cc: 'invalid', postalCode: 2000 },
  be_invalid_postal_code: { cc: 'be', postalCode: 'invalid' },
  be_no_cc: { postalCode: 2000 },
  be_no_postal_code: { cc: 'be' },
  nl_invalid_cc: { cc: 'invalid', postalCode: '2132WT', number: 66 },
  nl_invalid_number: { postalCode: '2132WT', number: 'invalid', cc: 'nl' },
  nl_invalid_postal_code: { postalCode: 'invalid', number: 66, cc: 'nl' },
  nl_no_cc: { postalCode: '2132WT', number: 66 },
  nl_no_number: { postalCode: '2132WT', cc: 'nl' },
  nl_no_postal_code: { number: 66, cc: 'nl' },
};

const cases = {
  postnl: {
    currentCarrier: 'postnl',
    platform: MYPARCEL,
    invalid: [
      { error: 'ERROR_INVALID_POSTAL_CODE', address: addresses.nl_invalid_postal_code },
      { error: 'ERROR_INVALID_CC', address: addresses.nl_invalid_cc },
      { error: 'ERROR_INVALID_NUMBER', address: addresses.nl_invalid_number },
    ],
    missing: [
      { error: 'ERROR_NO_POSTAL_CODE', address: addresses.nl_no_postal_code },
      { error: 'ERROR_NO_CC', address: addresses.nl_no_cc },
      { error: 'ERROR_NO_NUMBER', address: addresses.nl_no_number },
    ],
  },
  bpost: {
    platform: SENDMYPARCEL,
    currentCarrier: 'bpost',
    invalid: [
      { error: 'ERROR_INVALID_POSTAL_CODE', address: addresses.be_invalid_postal_code },
      { error: 'ERROR_INVALID_CC', address: addresses.be_invalid_cc },
    ],
    missing: [
      { error: 'ERROR_NO_POSTAL_CODE', address: addresses.be_no_postal_code },
      { error: 'ERROR_NO_CC', address: addresses.be_no_cc },
    ],
  },
  dpd: {
    platform: SENDMYPARCEL,
    currentCarrier: 'dpd',
    invalid: [
      { error: 'ERROR_INVALID_POSTAL_CODE', address: addresses.be_invalid_postal_code },
      { error: 'ERROR_INVALID_CC', address: addresses.be_invalid_cc },
    ],
    missing: [
      { error: 'ERROR_NO_POSTAL_CODE', address: addresses.be_no_postal_code },
      { error: 'ERROR_NO_CC', address: addresses.be_no_cc },
    ],
  },
};

/**
 * Test the given options against a fetchFunction.
 *
 * @param {object} obj - Destructured object.
 * @property {object} obj.options - Options object.
 * @property {Function} obj.fetchFunction - Fetch function to execute.
 *
 * @returns {Promise<void>}
 */
const testRequest = async({ options, tests, fetchFunction }) => {
  /**
   * @param {object} test - Test object.
   */
  // eslint-disable-next-line require-await
  await Promise.all(tests.map(async(test) => {
    const configBus = getConfigBus(options.platform);

    return Promise.all(configBus.config.carriers.map(async(carrier) => {
      configBus.$data.address = test.address;
      const { response } = await fetchFunction(carrier);

      expect(response).toEqual([]);

      /**
       * Check if the errors array contains an object with the expected error code.
       *
       * @see https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
       */
      expect(configBus.errors).toContainObject({ code: test.error }, test.address);
    }));
  }));
};

describe('API responses', () => {
  [
    fetchDeliveryOptions,
    fetchPickupLocations,
  ].forEach((fetch) => {
    test.each`
      carrier     | options         | tests                   | fetchFunction | type
      ${'postnl'} | ${cases.postnl} | ${cases.postnl.invalid} | ${fetch}      | ${'invalid'}
      ${'postnl'} | ${cases.postnl} | ${cases.postnl.missing} | ${fetch}      | ${'missing'}
      ${'bpost'}  | ${cases.bpost}  | ${cases.bpost.invalid}  | ${fetch}      | ${'invalid'}
      ${'bpost'}  | ${cases.bpost}  | ${cases.bpost.missing}  | ${fetch}      | ${'missing'}
      ${'dpd'}    | ${cases.dpd}    | ${cases.dpd.invalid}    | ${fetch}      | ${'invalid'}
      ${'dpd'}    | ${cases.dpd}    | ${cases.dpd.missing}    | ${fetch}      | ${'missing'}
    `(
  '$fetchFunction.name with $type address data returns usable errors for $options.platform/$carrier',
  testRequest
);
  });
});
