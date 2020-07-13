import address from './forms/address';
import codeFormats from './forms/codeFormats';
import objectGet from 'lodash-es/get';
import previews from '@/sandbox/config/tabs/previews';
import settings from '@/sandbox/config/tabs/settings';

const config = {
  forms: { address, codeFormats },
  tabs: { previews, settings },
};

export const configObject = {
  get(item) {
    return Object.freeze(objectGet(config, item));
  },
};
