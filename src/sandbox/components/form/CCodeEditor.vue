<template>
  <div
    v-click-outside="showCode"
    class="d-flex flex-column">
    <div
      v-show="codeShown"
      @click="hideCode">
      <CCodeDisplay
        class="mt-0 text-pre"
        :code="mutableValue"
        :language="language" />
    </div>
    <pre
      v-show="!codeShown"
      class="card code code--text overflow-visible text-pre">
      <CTextarea
        v-model="mutableValue"
        rows="20"
        :class="{
          'is-invalid': !valid,
        }"
        v-bind="filteredProps" />
    </pre>
  </div>
</template>

<script>
import CTextarea from '@/sandbox/components/form/CTextarea';
import ClickOutside from 'vue-click-outside';
import { formTextarea } from '@/sandbox/services/mixins/formTextarea';
import { formatCode } from '@/delivery-options/services/filters/formatCode';

export default {
  name: 'CCodeEditor',
  components: {
    CCodeDisplay: () => import(/* webpackChunkName: "components/CCodeDisplay" */ '@/sandbox/components/CCodeDisplay'),
    CTextarea,
  },

  directives: {
    ClickOutside,
  },

  mixins: [
    formTextarea,
  ],

  props: {
    language: {
      type: String,
      default: () => 'json',
    },
  },

  data() {
    return {
      valid: true,
      codeShown: true,
    };
  },

  computed: {
    mutableValue: {
      get() {
        return formatCode(this.value, 'json');
      },

      /**
       * Emit event with the new value.
       *
       * @param {*} value - New value.
       */
      set(value) {
        try {
          JSON.parse(value);
          this.valid = true;
          this.$emit('input', value);
        } catch (e) {
          // We're not using e because it will simply say it's invalid JSON.
          this.valid = false;
        }
      },
    },
  },
  methods: {
    showCode() {
      if (this.codeShown) {
        return;
      }

      this.codeShown = true;
    },

    hideCode() {
      this.codeShown = false;
    },
  },
};
</script>
