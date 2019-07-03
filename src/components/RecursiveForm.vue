<template>
  <div
    v-if="validChoices"
    :class="{
      [`myparcel-checkout__overflow-wrapper`]: option.overflow
    }">
    <table>
      <tr
        v-for="choice in validChoices"
        :key="option.name + '_' + choice.name"
        :class="{
          [`myparcel-checkout__${option.name}`]: true,
          [`myparcel-checkout__${option.name}--${choice.name}`]: true,
          'myparcel-checkout__choice-image': choice.hasOwnProperty('image')
        }">
        <td
          v-if="validChoices.length > 1"
          class="myparcel-checkout__input">
          <input
            v-if="option.type === 'checkbox'"
            :id="`myparcel-checkout--${option.name}--${choice.name}`"
            v-model="selected"
            type="checkbox"
            :name="option.name"
            :value="choice.name">

          <input
            v-else
            :id="`myparcel-checkout--${option.name}--${choice.name}`"
            v-model="selected"
            :type="option.type"
            :value="choice.name">
        </td>

        <td :colspan="validChoices.length <= 1 ? null : !!choice.price ? 1 : 2">
          <component
            :is="option.component"
            v-if="option.hasOwnProperty('component')"
            :parent="option"
            :data="choice"
            :selected="selected === choice.name"
            @click="selected = choice.name" />

          <template v-else>
            <label :for="`myparcel-checkout--${option.name}--${choice.name}`">
              <img
                v-if="choice.hasOwnProperty('image')"
                :src="choice.image"
                :alt="choice.name"
                :title="strings[choice.label]">
              <span
                v-else
                v-text="choice.plainLabel || strings[choice.label]" />

              <span
                v-if="!!choice.price"
                class="myparcel-checkout__float-right"
                :class="{
                  'myparcel-checkout__text-bold': option.type === 'checkbox'
                    ? selected.includes(choice.name)
                    : selected === choice.name,
                  'myparcel-checkout__text-green': config[choice.price] < 0
                }">
                <span v-text="config[choice.price] >= 0 ? '+ ' : '– '" />
                {{ formatPrice(choice.price) }}
              </span>
            </label>

            <template v-if="selected === choice.name && chosenOptions">
              <recursive-form
                v-for="subOption in chosenOptions"
                :key="choice.name + '_' + subOption.name"
                :option="subOption"
                :class="`myparcel-checkout__${option.name}--${choice.name}__options`"
                @update="$emit('update', $event)" />
            </template>
          </template>
        </td>
      </tr>
    </table>
  </div>
  <table v-else>
    <tr>
      <td>
        <select
          :id="`myparcel-checkout--${option.name}`"
          v-model="selected"
          class="myparcel-checkout__select"
          :name="option.name">
          <option
            v-for="(selectChoice, key) of option.choices"
            :key="key"
            :value="selectChoice"
            :selected="key === 0 ? 'selected' : null"
            v-text="selectChoice" />
        </select>
      </td>
    </tr>
  </table>
</template>

<script>
import PickupOption from './PickupOption';
import { configBus } from '../config/configBus';

export default {
  name: 'RecursiveForm',
  components: { PickupOption },
  props: {
    option: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      /**
       * Currently selected value.
       *
       * @type {Array|String}
       */
      selected: this.option.type === 'checkbox' ? [] : null,
    };
  },

  /**
   * Vue computed properties
   */
  computed: {
    Config: () => configBus,
    strings: () => configBus.textToTranslate,
    config: () => configBus.config,

    hasChoices() {
      return this.option.hasOwnProperty('choices') && !!this.option.choices && !!this.option.choices.length;
    },

    chosenOptions() {
      if (!this.hasChoices) {
        return null;
      }

      const choice = this.option.choices.find((choice) => choice.name === this.selected);
      return choice.hasOwnProperty('options') ? choice.options : null;
    },
    validChoices() {
      return this.option.type === 'select' ? false : this.option.choices;
    },
  },

  watch: {
    selected() {
      configBus.$emit('update', { name: this.option.name, value: this.selected });
    },
  },

  /**
   * Vue created hook.
   */
  created() {
    this.setSelected();
  },

  /**
   * Vue methods
   */
  methods: {
    // update: (event) => configBus.$emit('update', event),
    formatPrice: (price) => configBus.formatPrice(price),

    /**
     * Set default chosen value to either the previously set value for the current option, the option that has a
     * 'selected' attribute or the first option.
     */
    setSelected() {
      const { choices, type, name } = this.option;
      const isSet = configBus.values.hasOwnProperty(name);

      if (type === 'checkbox') {
        // If there's a value set dedupe the array of values, otherwise set empty array.
        this.selected = isSet ? [...new Set(configBus.values[name])] : [];

      } else if (isSet) {
        // If value is already set and the current option is selected.
        if (type === 'select') {
          this.selected = configBus.values[name];
        } else {
          this.selected = (choices.find((choice) => choice.name === configBus.values[name]) || choices[0]).name;
        }

      } else if (this.hasChoices) {
        // Set pre-selected value or fall back to first
        if (type === 'select') {
          this.selected = choices[0];
        } else {
          this.selected = (choices.find((choice) => choice.selected === true) || choices[0]).name;
        }
      }
    },
  },
};
</script>
