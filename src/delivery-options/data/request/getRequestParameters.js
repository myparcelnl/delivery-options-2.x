import { configBus } from '@/delivery-options/config/configBus';
import { getDefaultRequestParameters } from '@/delivery-options/data/request/getDefaultRequestParameters';
import { getOptionalRequestParameters } from '@/delivery-options/data/request/getOptionalRequestParameters';
import { getParametersByPlatform } from '@/delivery-options/data/request/requestData';

/**
 * Gather the parameters for the delivery options request.
 *
 * @see https://myparcelnl.github.io/api/#8
 *
 * @param {MyParcel.CarrierName} carrier - Carrier name or id.
 *
 * @returns {Object}
 */
export const getRequestParameters = (carrier = configBus.currentCarrier) => {
  const parameters = getDefaultRequestParameters();
  const optionalParameters = getOptionalRequestParameters();

  parameters.carrier = carrier;

  // Get the settings that are set in the config and add those to the parameters.
  const setParameters = Object.keys(optionalParameters).filter((value) => !!optionalParameters[value]);

  setParameters.forEach((option) => {
    parameters[option] = optionalParameters[option];
  });

  return {
    ...parameters,
    ...getParametersByPlatform(),
  };
};
