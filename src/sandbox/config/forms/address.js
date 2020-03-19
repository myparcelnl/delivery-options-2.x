import * as ADDRESS from '@/data/keys/addressKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import CCountrySelect from '@/sandbox/components/form/CCountrySelect';
import CNumber from '@/sandbox/components/form/CNumber';

const baseAddressForm = {
  title: 'Address',
  description: 'address',
  settings: [
    {
      key: ADDRESS.KEY,
      name: ADDRESS.CC,
      component: CCountrySelect,
      props: {
        label: STRINGS.CC,
      },
    },
    {
      key: ADDRESS.KEY,
      name: ADDRESS.POSTAL_CODE,
      props: {
        label: STRINGS.POSTAL_CODE,
        autocomplete: 'postal-code',
      },
    },
  ],
};

const cityField = {
  key: ADDRESS.KEY,
  name: ADDRESS.CITY,
  props: {
    label: STRINGS.CITY,
    autocomplete: 'address-level2',
  },
};

const numberField = {
  key: ADDRESS.KEY,
  name: ADDRESS.NUMBER,
  component: CNumber,
  props: {
    label: STRINGS.NUMBER,
    min: 1,
  },
};

const additionalSettings = {
  [MYPARCEL]: [numberField],
  [SENDMYPARCEL]: [cityField],
};

const getForm = (platform) => {
  const newForm = { ...baseAddressForm };

  additionalSettings[platform].map((item) => {
    return newForm.settings.push(item);
  });

  return Object.freeze(newForm);
};

export default {
  [MYPARCEL]: getForm(MYPARCEL),
  [SENDMYPARCEL]: getForm(SENDMYPARCEL),
};
