<template>
  <form class="form">
    <div class="alert alert-secondary my-3">
      <Heading :level="4">
        {{ $t(`platform.${platform}`) }}
      </Heading>

      <b-btn
        v-for="(link, index) in getPlatformData(platform).links"
        :key="'button_' + link.text"
        size="sm"
        :class="{
          'ml-1': index > 0,
        }"
        :href="link.href">
        <span v-t="link.text" />
        <font-awesome-icon
          class="ml-1"
          icon="external-link-alt" />
      </b-btn>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <Heading>Address</Heading>
        <FormGroup
          :level="2"
          :prefix="`${platform}.`"
          :form-item="$config.get(`forms.address.${platform}`)" />
      </div>
    </div>

    <FormGroup
      v-for="setting in resolvedForm"
      :key="`${platform}.${setting.title}`"
      :prefix="`${platform}.`"
      :form-item="setting" />
  </form>
</template>

<script>
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import FormGroup from './FormGroup';
import Heading from '@/sandbox/components/Heading';
import { platformTabs } from '@/config/platformConfig';

export default {
  name: 'SettingsForm',
  components: { Heading, FormGroup },

  props: {
    platform: {
      type: String,
      default: DEFAULT_PLATFORM,
    },
    form: {
      type: [Array, Function],
      default: null,
    },
  },

  data() {
    return {
      resolvedForm: null,
    };
  },

  /**
   * Prepare the form variable based on it being a function or Array.
   */
  beforeMount() {
    this.resolvedForm = typeof this.form === 'function'
      ? this.form()
      : this.form;
  },

  methods: {
    getPlatformData(platform) {
      return platformTabs.find(({ name }) => name === platform);
    },
  },
};
</script>
