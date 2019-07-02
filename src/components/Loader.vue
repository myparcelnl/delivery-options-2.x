<template>
  <div
    class="myparcel-checkout__loader"
    :class="{
      [`myparcel-checkout__loader--logo myparcel-checkout__loader--${carrier.name}`]: !!carrier
    }">
    <img
      v-if="getCarrierLogoURL(carrier)"
      :src="getCarrierLogoURL(carrier)"
      :alt="carrier.name">
    <span />
  </div>
</template>

<script>
import { configBus } from '../config/configBus';
import { formConfig } from '../config/formConfig';

export default {
  name: 'Loader',

  computed: {
    carrier() {
      return configBus.config.carriers.length === 1 ? formConfig.carriers[configBus.config.carriers[0]] : false;
    },
  },
  methods: {
    getCarrierLogoURL(carrier) {
      return carrier ? carrier.image : false;
    },
  },
};
</script>
