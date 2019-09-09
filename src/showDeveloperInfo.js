/**
 * Output some information in the console to help a developer get started quickly.
 */
export const showDeveloperInfo = () => {
  /* eslint-disable no-console */
  const styleHeader1 = [
    'font-size: 2em',
    'font-family: sans-serif',
    'padding: .2em 0;',
  ];
  const styleHeader2 = [
    'color: gray',
    'font-size: 1.4em',
    'font-style: italic',
    'font-family: sans-serif',
    'padding: .2em 0;',
  ];
  const styleText = [
    'color: white',
    'font-size: 1.2em',
    'font-family: sans-serif',
    'padding: .2em .3em;',
    'background-color: #21C493',
    'border-radius: 3px',
    'margin: .1em 0',
    'border-left: 3px solid #14785A',
  ];
  const styleCode = [
    'font-size: 1.2em',
    'padding: .2em 0;',
  ];
  console.log('%cWelcome to the MyParcel checkout!', styleHeader1.join(';'));
  console.log('%cCheck out README.md for the full documentation.', styleHeader2.join(';'));
  console.log('%cBy default, the checkout is not visible. \n'
      + 'To show it you must fill window.MyParcelConfig with at least the following data:', styleText.join(';'));
  console.log('%cwindow.MyParcelConfig = {\n'
      + '  config: {\n'
      + '    platform: \'belgie\',  \n'
      + '    carrierSettings: {'
      + '      bpost: {'
      + '        allowDeliveryOptions: true,'
      + '      }'
      + '    }'
      + '  },\n'
      + '  address: {\n'
      + '    cc: \'BE\',\n'
      + '    city: \'Antwerpen\',\n'
      + '    postalCode: \'1000\',\n'
      + '  }\n'
      + '};', styleCode.join(';'));
  console.log('%cAnd then send an event to tell the checkout to update its data:', styleText.join(';'));
  console.log('%cdocument.dispatchEvent(new Event(\'myparcel_update_checkout\'));', styleCode.join(';'));
  console.log('%cThis example shows a checkout with only bpost delivery options enabled.', styleText.join(';'));
  console.log('%c⬇ You can try it right here in your browser console. ⬇', styleText.join(';'));
  /* eslint-enable no-console */
};
