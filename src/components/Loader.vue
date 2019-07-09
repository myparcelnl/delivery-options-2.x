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
        class="myparcel-checkout__image myparcel-checkout__image--lg"
        :alt="onlyCarrier.name">
    </transition>
    <span />
  </div>
</template>

<script>
import { configBus } from '@/config/configBus';

export default {
  name: 'Loader',
  props: {
    carriers: {
      type: Array,
      default: null,
    },
  },

  computed: {
    onlyCarrier() {
      return this.carriers.length === 1 ? configBus.currentCarrier : false;
    },
    carrierLogo() {
      return this.onlyCarrier ? this.onlyCarrier.image : null;
    },
  },
};
</script>
