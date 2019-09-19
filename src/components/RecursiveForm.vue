<template>
  <table v-if="validChoices">
    <tr
      v-for="choice in validChoices"
      :key="option.name + '_' + choice.name"
      :class="{
        [`${$classBase}__choice`]: true,
        [`${$classBase}__choice--has-image`]: choice.hasOwnProperty('image'),
        [`${$classBase}__choice--disabled`]: choice.disabled
      }">
      <td :class="`${$classBase}__input`">
        <div>
          <input
            v-if="option.type === 'checkbox'"
            :id="`${$classBase}__${option.name}--${choice.name}`"
            v-model="selected[choice.name]"
            :class="choice.class"
            type="checkbox"
            :name="option.name"
            :disabled="choice.disabled ? 'disabled' : false"
            :value="choice.name">

          <input
            v-else
            :id="`${$classBase}__${option.name}--${choice.name}`"
            v-model="selected"
            :class="choice.class"
            :type="option.type"
            :disabled="choice.disabled || validChoices.length === 1 ? 'disabled' : false"
            :value="choice.name">
        </div>
      </td>

      <component
        :is="option.component"
        v-if="option.hasOwnProperty('component')"
        :colspan="validChoices.length <= 1 ? null : !!choice.price ? 1 : 2"
        :parent="option"
        :data="choice"
        :selected="selected === choice.name" />

      <td
        v-else
        :colspan="validChoices.length <= 1 ? null : !!choice.price ? 1 : 2">
        <label :for="`${$classBase}__${option.name}--${choice.name}`">
          <img
            v-if="choice.hasOwnProperty('image')"
            :src="choice.image"
            :alt="choice.name"
            :class="[
              `${$classBase}__image`,
              `${$classBase}__image--md`
            ]"
            :title="$configBus.strings[choice.label]">
          <span
            v-else
            v-text="choice.plainLabel || $configBus.strings[choice.label]" />

          <component
            :is="isBold(choice) ? 'strong' : 'span'"
            v-if="!!choice.price"
            :class="{
              [`${$classBase}__float--right`]: true,
              [`${$classBase}__text--green`]: $configBus.get(choice, 'price') < 0,
              ...choice.class,
            }">
            <span v-text="$configBus.get(choice, 'price') >= 0 ? '+ ' : '– '" />
            {{ $configBus.formatPrice(choice.price) }}
          </component>
        </label>

        <Loader
          v-if="loading === choice.name"
          type="inline" />

        <transition-group
          v-else-if="selected === choice.name && chosenOptions"
          name="fade"
          appear>
          <recursive-form
            v-for="subOption in chosenOptions"
            :key="choice.name + '_' + subOption.name"
            :option="subOption"
            :loading="loading" />
        </transition-group>
      </td>
    </tr>
    <tr v-if="hasPagination && mutablePagination < option.choices.length">
      <td colspan="2">
        <div :class="[`${$classBase}__button`]">
          <hr>
          <a
            href="#"
            @click.prevent="mutablePagination = mutablePagination + option.pagination"
            v-text="$configBus.strings.loadMore" />
        </div>
      </td>
    </tr>
  </table>
  <table v-else>
    <tr>
      <td>
        <select
          v-if="option.choices.length > 1"
          :id="`${$classBase}__${option.name}`"
          v-model="selected"
          :class="{
            [`${$classBase}__select`]: true,
            ...option.class,
          }"
          :name="option.name">
          <option
            v-for="(selectChoice, index) of option.choices"
            :key="index + '_' + selectChoice.name"
            :value="selectChoice.name"
            :selected="index === 0 ? 'selected' : null"
            v-text="selectChoice.label" />
        </select>
        <strong
          v-else
          v-text="option.choices[0].label" />
      </td>
    </tr>
  </table>
</template>

<script>
import * as EVENTS from '@/config/data/eventConfig';
import Loader from '@/components/Loader';
import PickupOption from './PickupOption';
import { ONLY_RECIPIENT, SHIPMENT_OPTIONS, formConfig } from '@/config/data/formConfig';

export default {
  name: 'RecursiveForm',
  components: {
    Loader,
    PickupOption,
  },

  props: {
    option: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      /**
       * Loading state.
       *
       * @type {Boolean|String}
       */
      loading: false,

      /**
       * Currently selected value.
       *
       * @type {Object|String}
       */
      selected: this.option.type === 'checkbox' ? {} : null,

      /**
       * Mutable copy of the option.pagination attribute. Unused if option has no pagination.
       *
       * @type {Number}
       */
      mutablePagination: null,
    };
  },

  computed: {
    /**
     * Whether the current option has choices or not.
     *
     * @returns {Boolean}
     */
    hasChoices() {
      return this.option.hasOwnProperty('choices') && !!this.option.choices && !!this.option.choices.length;
    },

    /**
     * Whether the current option has pagination or not.
     *
     * @returns {Boolean}
     */
    hasPagination() {
      return this.option.hasOwnProperty('pagination');
    },

    hasDependency() {
      return this.option.hasOwnProperty('dependency');
    },

    /**
     * Get the valid choices for the current option. Paginate if there is a pagination attribute present.
     *
     * @returns {Array}
     */
    validChoices() {
      if (this.hasPagination) {
        return this.option.choices.filter((item, index) => index < this.mutablePagination);
      }

      return this.option.type === 'select' ? false : this.option.choices;
    },

    /**
     * Returns the currently selected choice object.
     *
     * @returns {Object}
     */
    selectedChoice() {
      return this.option.choices.find((choice) => choice.name === this.selected);
    },
  },

  /**
   * @see https://github.com/foxbenjaminfox/vue-async-computed
   */
  asyncComputed: {
    /**
     * Currently chosen options, if options is a function.
     *
     * @returns {Promise<Array>}
     */
    async chosenOptions() {
      if (!this.hasChoices) {
        return null;
      }

      const choice = this.selectedChoice;

      if (!!choice && choice.hasOwnProperty('options')) {
        if (typeof choice.options === 'function') {
          this.loading = this.selected;

          const options = await choice.options();

          this.loading = false;
          return options;
        }
        return choice.options;
      }

      return null;
    },
  },

  watch: {
    /**
     * Watch the value of selected to emit a change event.
     */
    selected: {
      /**
       * @param {*} value - New value for current option.
       */
      handler(value) {
        this.$configBus.$emit(EVENTS.UPDATE, {
          name: this.option.name,
          value,
        });
      },
      /**
       * Set deep to true to be able to detect changes in Object properties.
       *
       * @see https://stackoverflow.com/questions/42133894/vue-js-how-to-properly-watch-for-nested-data
       */
      deep: typeof selected !== 'string',
    },
  },

  created() {
    if (this.hasPagination) {
      this.mutablePagination = this.option.pagination;
    }

    if (this.hasDependency) {
      this.$configBus.$on(EVENTS.AFTER_UPDATE, this.updateDependency);
    } else {
      this.setSelected();
    }
  },

  beforeDestroy() {
    if (this.hasDependency) {
      this.$configBus.$off(EVENTS.AFTER_UPDATE, this.updateDependency);
    }
  },

  methods: {
    isBold(choice) {
      return this.option.type === 'checkbox'
        ? this.selected[choice.name] === true
        : this.selected === choice.name;
    },

    /**
     * Recursively search for dependencies.
     *
     * @param {Object} dependencies - Haystack.
     * @param {Array|String} dependencyNames - Dependency name(s).
     *
     * @returns {*}
     */
    getDep(dependencies, dependencyNames) {
      // Create a new array to avoid overwriting dependencyNames.
      const needles = typeof dependencyNames === 'string' ? [dependencyNames] : [...dependencyNames];
      const { values } = this.$configBus;
      let result;

      needles.forEach((needle, index) => {
        if (dependencies.hasOwnProperty(needle)) {
          result = dependencies[needle][values[needle]];
          needles.splice(index, 1);

          // Get the first item if result is undefined
          if (!result) {
            result = dependencies[needle][Object.keys(dependencies[needle])[0]];
          }

          if (needles.length > 0) {
            result = this.getDep(result, needles);
          }
        }
      });

      return result;
    },

    /**
     * Update dependencies. Creates new choices array for the current option based on dependencies, their options and
     * the config.
     *
     * @param {{string}} name - Name of the field that has changed.
     */
    updateDependency({ name }) {
      const { dependencies } = this.$configBus;
      const { dependency } = { ...this.option };
      let dependencyName = dependency.name;

      // If dependency.name is an array, dependencyName is the last item.
      if (typeof dependency.name !== 'string') {
        dependencyName = dependency.name[dependency.name.length - 1];
      }

      // Return if the field that changed is not a dependency of this.option
      if (dependencyName !== name && !dependency.name.includes(name)) {
        return;
      }

      const deps = this.getDep(dependencies, dependency.name);

      if (!!deps) {
        this.option.choices = Object.keys(deps[this.option.name]).reduce((choices, option) => {
          const choiceOption = dependency.hasOwnProperty('parent')
            ? formConfig[dependency.parent].options[option]
            : formConfig[option];

          // If choice does not exist in the config, ignore it.
          if (!choiceOption) {
            return choices;
          }

          let choice = {
            ...choiceOption,
            name: option,
          };

          // Apply transform function to the new choice, if present.
          if (dependency.hasOwnProperty('transform') && typeof dependency.transform === 'function') {
            choice = dependency.transform(choice, deps[this.option.name][choice.name]);
          }

          // Only add the setting if it's enabled in the config
          if (this.$configBus.isEnabled(choice)) {
            choices.push(choice);
          }

          return choices;
        }, []);
      }

      // Select one of the newly added choices.
      this.setSelected();
    },

    /**
     * Get the name of the selected choice for given option. The chosen value is either the previously set value for
     *  current option, the option that has 'selected: true' or the first option.
     *
     * @param {Object} option - Option object.
     *
     * @param {Array} option.choices - Object choices.
     * @param {String} option.type - Object type.
     * @param {String} option.name - Object name.
     */
    setSelected(option = this.option) {
      const { choices, type, name } = option;
      const [firstChoice] = choices;
      const isSet = this.$configBus.values.hasOwnProperty(name);
      const setValue = this.$configBus.values[name];
      const hasChoices = !!choices && choices.length > 0;

      let selected;

      if (type === 'checkbox') {
        // If there's a value set dedupe the array of values, otherwise set empty array.
        selected = choices.reduce((currentValue, choice) => {

          /**
           * If the choice is disabled set it to its only allowed value.
           *
           * @see src/data/delivery/formatShipmentOptions.js
           */
          if (choice.disabled === true) {
            return { ...currentValue, [choice.name]: choice.selected };
          }

          /**
           * If choice is already set just return it. Note `setValue` being the initialValue of reduce().
           */
          if (currentValue.hasOwnProperty(choice.name)) {
            return currentValue;
          }

          /**
           * If the choice is enabled in the config return the value of choice.selected.
           */
          if (this.$configBus.isEnabled(choice)) {
            return {
              ...currentValue,
              [choice.name]: choice.selected === true,
            };
          }

          /**
           * If the choice is not enabled, return null instead of omitting the property entirely, for clarity.
           */
          return {
            ...currentValue,
            [choice.name]: null,
          };
        }, setValue || {});

      } else if (type === 'select') {
        if (isSet) {
          selected = setValue;
        } else if (hasChoices) {
          selected = firstChoice.name;
        }
      } else if (isSet && !!setValue) {
        // If this option is in configBus.values, select it.
        selected = (choices.find((choice) => choice.name === setValue) || firstChoice).name;
      } else if (hasChoices) {
        // If nothing was selected, choose the option with a selected attribute or just get the first option.
        selected = (choices.find((choice) => choice.selected === true) || firstChoice).name;
      }

      this.selected = selected;
    },
  },
};
</script>
