import * as CONFIG from '@/data/keys/configKeys';
import * as CONSTS from '@/data/keys/settingsConsts';
import CCodeEditor from '@/sandbox/components/form/CCodeEditor';
import CNumber from '@/sandbox/components/form/CNumber';
import CSelect from '@/sandbox/components/form/CSelect';
import CToggle from '@/sandbox/components/form/CToggle';
import { inAnyCarrier } from '@/sandbox/settings/conditions/inAnyCarrier';

export const featuresForm = [
  {
    key: CONFIG.KEY,
    component: CToggle,
    name: CONFIG.FEATURE_ALLOW_RETRY,
  },
  {
    key: CONFIG.KEY,
    name: CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
    component: CSelect,
    props: {
      options: CONSTS.PICKUP_LOCATIONS_VIEWS,
    },
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
  {
    key: CONFIG.KEY,
    component: CToggle,
    name: CONFIG.FEATURE_PICKUP_SHOW_DISTANCE,
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
  {
    key: CONFIG.KEY,
    component: CCodeEditor,
    name: CONFIG.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA,
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
  {
    key: CONFIG.KEY,
    component: CNumber,
    name: CONFIG.FEATURE_MAX_PAGE_ITEMS,
    props: {
      min: CONSTS.PICKUP_MIN_PAGE_ITEMS_LIMIT,
      max: CONSTS.PICKUP_MAX_PAGE_ITEMS_LIMIT,
    },
    conditions: [
      inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
    ],
  },
];
