<template>
  <component
    :is="'h' + level"
    :id="id || uniqueId">
    <slot />
    <Help
      v-if="helpText"
      triggers="hover"
      placement="bottom-right"
      :target="id || uniqueId"
      :content="$te(helpText) ? $t(helpText) : helpText" />
  </component>
</template>

<script>
import Help from '@/sandbox/components/Help';
import { uniqueIdMixin } from '@/sandbox/services/mixins/uniqueIdMixin';

export default {
  name: 'Heading',
  components: { Help },

  mixins: [
    uniqueIdMixin,
  ],

  /* eslint-disable no-magic-numbers */
  props: {
    id: {
      type: String,
      default: null,
    },
    level: {
      type: Number,
      default: 1,
    },
    helpText: {
      type: String,
      default: null,
    },
  },
  /* eslint-enable no-magic-numbers */
};
</script>
