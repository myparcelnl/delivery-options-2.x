/* eslint-disable no-unused-vars */

/**
 * API error code when any address part is wrong.
 *
 * @type {Number}
 */
export const ADDRESS_ERROR = 3505;

const ERROR_NO_CC = 3224;
const ERROR_NO_POSTAL_CODE = 3212;
const ERROR_INVALID_POSTAL_CODE = 3505;
// "Country not supported"
const ERROR_COUNTRY_NOT_SUPPORTED = 3506;
// be: "delivery_options can only be used in Belgium (cc=BE)"
// nl: "delivery_options can only be used in the Netherlands or Belgium"
const ERROR_NL_INVALID_CC = 3212;
const ERROR_NO_NUMBER = 3212;

const ERROR_INVALID_CARRIER = 3728;
