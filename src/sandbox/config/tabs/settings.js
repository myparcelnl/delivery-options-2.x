import { MYPARCEL } from '@/data/keys/platformKeys';
import SettingsForm from '@/sandbox/components/SettingsForm';
import { createSettings } from '@/sandbox/settings/form';
import { platforms } from '@/config/platformConfig';

export default platforms
  // Todo: Remove this filter when switching carriers updates the form items' disabled state properly.
  .filter((platform) => platform !== MYPARCEL)
  .map((platform) => ({
    name: platform,
    label: `platform.${platform}`,
    component: SettingsForm,
    props: {
      platform,
      form: () => createSettings(platform),
    },
  }));
