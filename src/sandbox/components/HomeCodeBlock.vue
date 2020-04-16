<template>
  <div class="code-block">
    <p v-t="'code.description'" />

    <CRadioGroup
      v-model="format"
      :options="$config.get('forms.codeFormats')" />

    <CCodeDisplay
      :code="code"
      :loading="codeRefreshing"
      :allow-hover="allowHoverFor"
      :language="format"
      @click="handleClick" />
  </div>
</template>

<script>
import * as EVENTS from '@/config/eventConfig';
import {
  CODE_FORMAT_JAVASCRIPT,
  CODE_FORMAT_JAVASCRIPT_ES6,
  CODE_FORMAT_JSON,
} from '@/sandbox/config/forms/codeFormats';
import CRadioGroup from '@/sandbox/components/form/CRadioGroup';
import debounce from 'lodash-es/debounce';
import { flattenObject } from '@/helpers/flattenObject';
import { formatCode } from '@/delivery-options/services/filters/formatCode';
import intersection from 'lodash-es/intersection';
import last from 'lodash-es/last';
import pick from 'lodash-es/pick';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';

export default {
  name: 'HomeCodeBlock',
  components: {
    CRadioGroup,
    CCodeDisplay: () => import(/* webpackChunkName: "components/CCodeDisplay" */ '@/sandbox/components/CCodeDisplay'),
  },

  props: {
    default: {
      type: Boolean,
    },
  },

  data() {
    return {
      allowHoverFor: [],
      codeRefreshing: false,
      settingsKeys: null,
      mutableCode: {},
      format: 'javascript',
    };
  },

  computed: {
    code() {
      return this.getFormattedCode(this.format);
    },
  },

  created() {
    const DEBOUNCE_DELAY = 50;
    this.settingsKeys = Object.keys(flattenObject(sandboxConfigBus.settings));

    this.getHoverableItems();
    this.setCode();

    sandboxConfigBus.$on('updated_settings', this.setCode);
    // Trigger setCode when new formItems have been rendered, which happens when switching platform.
    sandboxConfigBus.$on('created:formItem', debounce(() => this.setCode(), DEBOUNCE_DELAY));
  },

  beforeDestroy() {
    sandboxConfigBus.$off('updated_settings', this.setCode);
  },

  methods: {
    /**
     * @param {HTMLElement} eventTarget
     */
    handleClick(eventTarget) {
      let id = eventTarget.innerText;
      const flat = flattenObject(this.mutableCode);

      const configKey = Object.keys(flat)
        .map((item) => item.split('.'))
        .find((item) => last(item) === id);

      if (!configKey) {
        return;
      }

      id = `${sandboxConfigBus.platform}.${configKey.join('.')}`;
      sandboxConfigBus.$emit('click:code', id);
    },

    /**
     * Get all the keys from the default settings to determine which items in the code should be hover- and clickable.
     */
    getHoverableItems() {
      this.allowHoverFor = this.settingsKeys.reduce((acc, item) => {
        const newItem = last(item.split('.'));

        if (!acc.includes(newItem)) {
          acc.push(newItem);
        }

        return acc;
      }, []);
    },

    /**
     * Update the code while using the codeRefreshing variable to show the user something happened. Filters the code by
     *  items that are actually in the settings form.
     *
     * @param {Object} settings - Settings to convert to code.
     */
    setCode(settings = sandboxConfigBus.settings) {
      const REFRESH_DELAY = 300;
      this.codeRefreshing = true;

      // Filter the settings by items that are actually in the current form.
      const newSettings = intersection(
        Object.keys(flattenObject(settings)),
        [...sandboxConfigBus.itemsInForm],
      );

      const filteredSettings = pick(settings, newSettings);

      this.mutableCode = Object.assign(filteredSettings[sandboxConfigBus.platform]);

      setTimeout(() => {
        this.codeRefreshing = false;
      }, REFRESH_DELAY);
    },

    /**
     * Format mutableCode in given language and return it.
     *
     * @param {String} language
     *
     * @returns {String}
     */
    getFormattedCode(language) {
      const code = formatCode(this.mutableCode);
      let value = code;

      switch (language) {
        case CODE_FORMAT_JSON:
          value = JSON.stringify(this.mutableCode, null, 2);
          break;
        case CODE_FORMAT_JAVASCRIPT_ES6:
          value = `document.dispatchEvent(new CustomEvent('${EVENTS.UPDATE_DELIVERY_OPTIONS}', { detail: ${code}}));`;
          break;
        case CODE_FORMAT_JAVASCRIPT:
          value = `window.MyParcelConfig = ${code};`;
          break;
      }

      return value;
    },
  },
};
</script>
