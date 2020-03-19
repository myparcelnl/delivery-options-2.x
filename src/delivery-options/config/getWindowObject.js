/**
 * Get the window object supplied by the environment we're in. Parse it as JSON if needed.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const getWindowObject = () => {
  // Allow mocking for user and tests.
  if (!window.hasOwnProperty('MyParcelConfig')) {
    if (['development', 'test'].includes(process.env.NODE_ENV)) {
      window.MyParcelConfig = {};
    } else {
      throw 'No config found! (window.MyParcelConfig is required.)';
    }
  }

  return typeof window.MyParcelConfig === 'string'
    ? JSON.parse(window.MyParcelConfig)
    : window.MyParcelConfig;
};
