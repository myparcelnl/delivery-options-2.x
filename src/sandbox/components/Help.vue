<template>
  <span>
    <font-awesome-icon
      icon="info-circle"
      :class="{ [`text-${variant}`]: variant }" />

    <b-popover
      :target="target"
      v-bind="filteredProps">
      <slot />
    </b-popover>
  </span>
</template>

<script>
import debounce from 'lodash-es/debounce';
import { hasVariantProp } from '@/sandbox/services/mixins/hasVariantProp';

export default {
  name: 'Help',

  mixins: [
    hasVariantProp,
  ],

  props: {
    target: {
      type: String,
      default: null,
    },

    content: {
      type: String,
      default: null,
    },

    triggers: {
      type: String,
      default: 'click',
    },

    placement: {
      type: String,
      default: () => 'right',
    },

    compactPlacement: {
      type: String,
      default: () => 'top',
    },
  },

  data() {
    return {
      mutablePlacement: null,
    };
  },

  computed: {
    filteredProps() {
      return {
        ...this.$props,
        placement: this.mutablePlacement,
      };
    },
  },

  created() {
    const setPlacement = () => {
      const SMALL_SCREEN_WIDTH = 767;

      if (window.innerWidth <= SMALL_SCREEN_WIDTH) {
        this.mutablePlacement = this.$props.compactPlacement;
        return;
      }

      this.mutablePlacement = this.$props.placement;
    };

    window.addEventListener('resize', debounce(setPlacement, 100));
    setPlacement();
  },
};
</script>
