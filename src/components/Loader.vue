<template>
  <div
    class="myparcel-checkout__loader"
    :class="{
      [`myparcel-checkout__loader--logo myparcel-checkout__loader--${onlyCarrier.name}`]: !!onlyCarrier
    }">
    <transition name="fade">
      <img
        v-if="carrierLogo"
        :src="carrierLogo"
        :alt="onlyCarrier.name">
    </transition>
    <span />
  </div>
</template>

<script>
import { appConfig } from '../config/appConfig';

export default {
  name: 'Loader',
  props: {
    carrier: {
      type: Array,
      default: null,
    },
  },

  computed: {
    onlyCarrier() {
      return this.carrier ? this.carrier[0] : false;
    },
    carrierLogo() {
      return this.onlyCarrier ? appConfig.assetsUrl + this.onlyCarrier.meta.logo_svg : null;
    },
  },
};
</script>
