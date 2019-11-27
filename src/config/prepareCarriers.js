/**
 * Allow array of strings, single string and comma separated strings as input for carriers.
 *
 * @param {MyParcelDeliveryOptions.Configuration} data - Data object.
 *
 * @returns {Object}
 */
export const prepareCarriers = (data) => {
  return Object.keys(data.config.carrierSettings || {});
};
