import * as SETTINGS from '@/config/data/settingsConfig';
import { FLESPAKKET, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';

/**
 * Gather the parameters for the delivery options request.
 *
 * @see https://myparcelnl.github.io/api/#8
 *
 * @param {MyParcel.CarrierData} carrier - Carrier to use.
 *
 * @returns {Object}
 */
export const getRequestParameters = (carrier = configBus.currentCarrier) => {
  const parametersNL = {
    monday_delivery: configBus.get(SETTINGS.ALLOW_MONDAY_DELIVERY),
  };

  const parametersBE = {
    // TODO:
    //  "Day-picker is nog niet van toepassing voor SendMyParcel. De data die terugkomt is zelf opgebouwd door JW
    // en komt niet officieel uit bpost/DPD." < uit https://jira.dmp.zone/browse/MY-12648 Wanneer dit niet meer
    // van toepassing is moet deze override weg.
    deliverydays_window: 1,
  };

  const parametersByPlatform = {
    [MYPARCEL]: parametersNL,
    [FLESPAKKET]: parametersNL,
    [SENDMYPARCEL]: parametersBE,
  };

  const dropOffDays = configBus.get(SETTINGS.DROP_OFF_DAYS) || null;

  /**
   * These parameters will be added to the request URL.
   *
   * @type {Object}
   */
  const parameters = {
    /**
     * The endpoints we use in this application follow the JSON API "Inclusion of Related Resources" standard.
     *
     * @see https://jsonapi.org/format/#fetching-includes
     */
    include: 'shipment_options',

    platform: configBus.get(SETTINGS.PLATFORM),
    carrier,

    cc: configBus.address.cc,
    postal_code: configBus.address.postalCode,
    number: configBus.address.number,
  };

  /**
   * These settings are optional. If they are not defined by the user they are not added to the parameters.
   *
   * @type {Object}
   */
  const optionalParameters = {
    cutoff_time: configBus.get(SETTINGS.CUTOFF_TIME),
    deliverydays_window: configBus.get(SETTINGS.DELIVERY_DAYS_WINDOW),
    // Convert dropOffDays to a semicolon separated string if needed
    dropoff_days: Array.isArray(dropOffDays) ? dropOffDays.join(';') : dropOffDays,
    dropoff_delay: configBus.get(SETTINGS.DROP_OFF_DELAY),
  };

  // Get the settings that are set in the config and add those to the parameters.
  const setOptions = Object.keys(optionalParameters).filter((value) => !!optionalParameters[value]);
  setOptions.forEach((option) => {
    parameters[option] = optionalParameters[option];
  });

  return {
    ...parameters,
    ...parametersByPlatform[configBus.get(SETTINGS.PLATFORM)],
  };
};
