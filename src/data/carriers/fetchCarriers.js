import { METHOD_SEARCH, fetchFromEndpoint } from '../../services/fetch';
import { CARRIER_POSTNL } from '../../config/formConfig';
import { Carriers } from '../../../myparcel-js-sdk/src/endpoint/carriers';
import demoCarriers from '../../config/demo/demoCarriers';

/**
 * Fetch carrier data.
 *
 * @param {number} carrier - Carrier ID.
 *
 * @returns {Promise<Object>}
 */
export function fetchCarrierData(carrier = CARRIER_POSTNL) {
  return fetchFromEndpoint(Carriers, {
    method: METHOD_SEARCH,
    mockData: demoCarriers,
  }, { carrier });
}
