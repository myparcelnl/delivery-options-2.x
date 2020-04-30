<template>
  <table
    v-if="mutableOption.hasOwnProperty('component') && mutableOption.loop === false"
    :class="`${$classBase}__table`">
    <tr
      :class="`${$classBase}__choice`">
      <component
        :is="mutableOption.component"
        :data="mutableOption" />
    </tr>
  </table>

  <table
    v-else-if="validChoices"
    :class="`${$classBase}__table`">
    <tr
      v-for="choice in validChoices"
      :key="mutableOption.name + '_' + choice.name"
      v-test
      :class="{
        [`${$classBase}__choice`]: true,
        [`${$classBase}__choice--has-image`]: choice.hasOwnProperty('image'),
        [`${$classBase}__choice--disabled`]: choice.disabled,
      }">
      <td
        v-if="mutableOption.type !== 'heading'"
        :class="`${$classBase}__input`">
        <div>
          <input
            v-if="mutableOption.type === 'checkbox'"
            :id="`${$classBase}__${mutableOption.name}--${choice.name}`"
            v-model="selected[choice.name]"
            v-test
            :class="choice.class"
            type="checkbox"
            :name="mutableOption.name"
            :disabled="choice.disabled ? 'disabled' : false"
            :value="choice.name">

          <input
            v-else
            :id="`${$classBase}__${mutableOption.name}--${choice.name}`"
            v-model="selected"
            v-test
            :class="choice.class"
            :type="mutableOption.type"
            :disabled="choice.disabled || validChoices.length === 1 ? 'disabled' : false"
            :value="choice.name">
        </div>
      </td>

      <component
        :is="mutableOption.component"
        v-if="mutableOption.hasOwnProperty('component')"
        v-test="`${mutableOption.name}--${choice.name}__${mutableOption.component.name}`"
        :colspan="validChoices.length <= 1 ? null : !!choice.price ? 1 : 2"
        :data="choice"
        :is-selected="isSelected(choice)" />

      <td
        v-else
        :colspan="validChoices.length <= 1 ? null : !!choice.price ? 1 : 2">
        <label :for="`${$classBase}__${mutableOption.name}--${choice.name}`">
          <img
            v-if="choice.hasOwnProperty('image')"
            :src="choice.image"
            :alt="choice.name"
            :class="[
              `${$classBase}__image`,
              `${$classBase}__image--md`,
            ]"
            :title="$configBus.strings[choice.label]">
          <span
            v-else
            v-text="choice.plainLabel || $configBus.strings[choice.label]" />

          <component
            :is="isSelected(choice) ? 'strong' : 'span'"
            v-if="!!choice.price"
            :class="{
              [`${$classBase}__float--right`]: true,
              [`${$classBase}__text--green`]: $configBus.get(choice, 'price') < 0,
              ...choice.class,
            }">

            <span
              v-if="$configBus.get(choice, 'price') === 0"
              v-text="$configBus.strings.free" />
            <template v-else>
              <span v-text="$configBus.get(choice, 'price') >= 0 ? '+ ' : '– '" />
              {{ formatPrice(choice.price) }}
            </template>
          </component>
        </label>

        <Loader
          v-if="loading === choice.name"
          type="inline" />

        <transition-group
          v-else-if="isSelected(choice) && chosenOptions"
          tag="div"
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
    <tr v-if="hasPagination && mutablePagination < mutableChoices.length">
      <td colspan="2">
        <div :class="[`${$classBase}__button`]">
          <hr>
          <a
            href="#"
            @click.prevent="mutablePagination = mutablePagination + mutableOption.pagination"
            v-text="$configBus.strings.loadMore" />
        </div>
      </td>
    </tr>
  </table>
  <table
    v-else
    :class="`${$classBase}__table`">
    <tr>
      <td>
        <label>
          <select
            :id="`${$classBase}__${mutableOption.name}`"
            :name="mutableOption.name"
            v-if="mutableChoices.length > 1"
            :class="{
              [`${$classBase}__w-100`]: true,
              ...mutableOption.class,
            }"
            v-model="selected">
            <option
              v-for="(selectChoice, index) of mutableChoices"
              :key="index + '_' + selectChoice.name"
              :value="selectChoice.name"
              v-text="selectChoice.label" />
          </select>
          <strong
            v-else v-text="firstChoice.label" />
        </label>
      </td>
    </tr>
  </table>
</template>

<script>
import * as CONFIG from '@/data/keys/configKeys';
import * as EVENTS from '@/config/eventConfig';
import Loader from '@/delivery-options/components/Loader';
import PickupOption from '../Pickup/PickupOption';
import debounce from 'lodash-es/debounce';
import { formConfig } from '@/config/formConfig';
import { getChoiceOrFirst } from '@/delivery-options/components/RecursiveForm/getChoiceOrFirst';
import { getDependencies } from './getDependencies';
import { setCheckboxSelected } from './setCheckboxSelected';

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
    const CHOICES_DEBOUNCE_DELAY = 10;

    return {

      /**
       * Mutable copy of this.option to allow a watcher to latch onto it and correctly make its Array/Object properties
       *  reactive, if any.
       *
       * @type {Object}
       */
      mutableOption: this.option,

      /**
       * @type {Array}
       */
      mutableChoices: this.option.choices || [],

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
       *
       * @see https://vuejs.org/v2/guide/components-props.html#One-Way-Data-Flow
       */
      mutablePagination: null,

      /**
       * Event listeners object. Stored here so we can add and remove them easily.
       */
      listeners: {

        /**
         * Empty this.selected.
         */
        unselect: () => {
          this.selected = null;
        },

        /**
         * Update dependencies of the current option. Without this.$nextTick switching carriers for the first time will
         *  not show all the options. Has a tiny debounce delay to avoid update issues.
         *
         * @param {Object} args - Arguments from the event.
         *
         * @see https://vuejs.org/v2/api/#Vue-nextTick
         */
        updateDependency: debounce((args) => {
          this.$nextTick(() => {
            this.getChoicesByDependency(args);
          });
        }, CHOICES_DEBOUNCE_DELAY),
      },
    };
  },

  computed: {

    /**
     * Return the first choice in the choices array.
     *
     * @returns {Object}
     */
    firstChoice() {
      return this.mutableChoices[0];
    },

    /**
     * Whether the current option has choices or not.
     *
     * @returns {Boolean}
     */
    hasChoices() {
      return !!this.mutableChoices.length;
    },

    /**
     * Whether the current option has pagination or not.
     *
     * @returns {Boolean}
     */
    hasPagination() {
      return this.mutableOption.hasOwnProperty('pagination');
    },

    /**
     * Whether the current option has one or more dependencies or not.
     *
     * @returns {Boolean}
     */
    hasDependency() {
      return this.mutableOption.hasOwnProperty('dependency');
    },

    /**
     * Get the valid choices for the current option. Paginate if there is a pagination attribute present.
     *
     * @returns {Array}
     */
    validChoices() {
      if (this.hasPagination) {
        return this.mutableChoices.filter((item, index) => index < this.mutablePagination);
      }

      return this.mutableOption.type === 'select' ? false : this.mutableChoices;
    },

    /**
     * Returns the currently selected choice object.
     *
     * @returns {Object}
     */
    selectedChoice() {
      return this.mutableChoices.find((choice) => this.isSelected(choice));
    },
  },

  /**
   * Async computed properties plugin. We're using this to be able to load choices on the fly.
   *
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

          choice.options = options;

          return choice.options;
        }

        return choice.options;
      }

      return null;
    },
  },

  watch: {
    option: {

      /**
       * @param {Object} newOption - New value for current option.
       */
      handler(newOption) {
        this.mutableOption = newOption;
        this.mutableChoices = newOption.choices;

        if (!this.hasDependency) {
          this.$nextTick(() => {
            this.setSelected();
          });
        }
      },

      /**
       * Set deep to true to detect the Array choices changing. If we don't use this watcher the application can't
       *  detect changes between options with identical names and types but different choices.
       *
       * @example
       * When switching the parent option, `carrier` in this example, from `bpost` to `dpd`, `this.option` changes from:
       *   {
       *     name: 'deliveryDate',
       *     type: 'formSelect',
       *     choices: Array
       *   },
       *  To:
       *   {
       *     name: 'deliveryDate',
       *     type: 'formSelect',
       *     choices: Array
       *   }
       * Now, no matter the contents of `choices`, (2 choices, 7? Just one?) Vue can't see if they changed, won't update
       *  and will just display the previous value of `this.option`.
       *
       * @see https://stackoverflow.com/questions/42133894/vue-js-how-to-properly-watch-for-nested-data
       */
      deep: true,

      /**
       * To run the handler on creation.
       */
      immediate: true,
    },

    /**
     * Watch the value of selected to emit a change event.
     */
    selected: {

      /**
       * @param {*} value - New value for current option.
       */
      handler(value) {
        if (value === null) {
          return;
        }

        this.$configBus.$emit(EVENTS.UPDATE, {
          name: this.option.name,
          value,
        });
      },
      deep: typeof selected !== 'string',
      immediate: true,
    },
  },

  created() {
    if (this.hasPagination) {
      this.mutablePagination = this.mutableOption.pagination;
    }

    if (this.hasDependency) {
      this.$configBus.$on(EVENTS.AFTER_UPDATE, this.listeners.updateDependency);
    }

    document.addEventListener(EVENTS.DISABLE_DELIVERY_OPTIONS, this.listeners.unselect);
    document.addEventListener(EVENTS.HIDE_DELIVERY_OPTIONS, this.listeners.unselect);
  },

  beforeDestroy() {
    if (this.hasDependency) {
      this.$configBus.$off(EVENTS.AFTER_UPDATE, this.listeners.updateDependency);
    }

    document.removeEventListener(EVENTS.DISABLE_DELIVERY_OPTIONS, this.listeners.unselect);
    document.removeEventListener(EVENTS.HIDE_DELIVERY_OPTIONS, this.listeners.unselect);
  },

  methods: {
    /**
     * @param {Object} choice - The choice to check.
     *
     * @returns {Boolean}
     */
    isSelected(choice) {
      if (typeof this.selected === 'string') {
        return this.selected === choice.name;
      }

      return this.selected ? this.selected[choice.name] === true : false;
    },

    /**
     * Update dependencies. Creates new choices array for the current option based on dependencies, their options and
     * the config.
     *
     * @param {{string}} name - Name of the field that has changed.
     */
    getChoicesByDependency({ name }) {
      const baseDependencies = this.$configBus.dependencies[this.$configBus.currentCarrier];

      if (!baseDependencies) {
        return;
      }

      const { dependency } = this.option;
      let dependencyName = dependency.name;

      // If dependency.name is an array, dependencyName is the last item.
      if (Array.isArray(dependency.name)) {
        dependencyName = dependency.name[dependency.name.length - 1];
      }

      // Return if the field that changed is not a dependency of the current option
      if (dependencyName !== name && !dependency.name.includes(name)) {
        return;
      }

      const dependencies = getDependencies(baseDependencies, dependency.name);

      if (!dependencies) {
        this.setSelected();

        return;
      }

      const newChoices = Object.keys(dependencies[this.mutableOption.name]).reduce((choices, option) => {
        return this.createChoices(choices, option, dependencies, dependency);
      }, []);

      this.option.choices = [...newChoices];

      this.$nextTick(this.setSelected);
    },

    /**
     * @param {Array} choices
     * @param {Object} option
     * @param {Array} dependencies
     * @param {Object} dependency
     *
     * @returns {Array}
     */
    createChoices(choices, option, dependencies, dependency) {
      const options = dependency.hasOwnProperty('parent')
        ? formConfig
          .find(({ name }) => name === dependency.parent)
          .options
        : formConfig;

      let choice = options.find(({ name }) => name === option);

      // If choice does not exist in the config, ignore it.
      if (!choice) {
        return choices;
      }

      // Clone the object to avoid mutating the formConfig
      choice = { ...choice };

      // Apply transform function to the new choice, if present.
      if (dependency.hasOwnProperty('transform') && typeof dependency.transform === 'function') {
        choice = dependency.transform(choice, dependencies[this.mutableOption.name][choice.name]);
      }

      // Only add the setting if it's enabled in the config
      if (this.$configBus.isEnabled(choice)) {
        choices.push(choice);
      }

      return choices;
    },

    /**
     * Get the name of the selected choice for the component. The chosen value is either the previously set value for
     *  current option, the option that has 'selected: true' or the first option.
     */
    setSelected() {
      const { choices, name, type } = this.mutableOption;
      const isSet = this.$configBus.values.hasOwnProperty(name);
      const setValue = this.$configBus.values[name];
      const hasChoices = choices.length > 0;

      let selected;

      // If there's nothing to formSelect, just return.
      if (!hasChoices) {
        return;
      }

      if (type === 'checkbox') {
        // If there's a value set dedupe the array of values, otherwise set empty object.
        selected = choices.reduce(setCheckboxSelected, setValue || {});
      } else if (type === 'select') {
        if (isSet) {
          selected = getChoiceOrFirst(choices, (choice) => choice.name === setValue);
        } else if (hasChoices) {
          selected = this.firstChoice.name;
        }
      } else if (isSet && !!setValue) {
        // If this option is in configBus.values, formSelect it.
        selected = getChoiceOrFirst(choices, (choice) => choice.name === setValue);
      } else if (hasChoices) {
        // If nothing was selected, choose the option with a selected attribute or just get the first option.
        selected = getChoiceOrFirst(choices, (choice) => choice.selected === true);
      }

      this.selected = selected;
    },

    /**
     * @param {String|Number} price - Price config item or value.
     *
     * @returns {String}
     */
    formatPrice(price) {
      if (typeof price === 'string') {
        price = this.$configBus.get(price, 'price');
      }

      const formatter = new Intl.NumberFormat(
        this.$configBus.get(CONFIG.LOCALE),
        {
          style: 'currency',
          currency: this.$configBus.get(CONFIG.CURRENCY),
        },
      );

      return formatter.format(Math.abs(price));
    },
  },
};
</script>
