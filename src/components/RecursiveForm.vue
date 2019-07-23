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
          'myparcel-checkout__choice--has-image': choice.hasOwnProperty('image'),
          'myparcel-checkout__choice--disabled': choice.disabled
        }">
        <td
          v-if="validChoices.length > 1 && option.type !== 'plain'"
          class="myparcel-checkout__input">
          <div>
            <input
              v-if="option.type === 'checkbox'"
              :id="`myparcel-checkout--${option.name}--${choice.name}`"
              v-model="selected"
              type="checkbox"
              :name="option.name"
              :disabled="choice.disabled ? 'disabled' : false"
              :value="choice.name">

            <input
              v-else
              :id="`myparcel-checkout--${option.name}--${choice.name}`"
              v-model="selected"
              :type="option.type"
              :disabled="choice.disabled ? 'disabled' : false"
              :value="choice.name">
          </div>
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
                class="myparcel-checkout__image myparcel-checkout__image--md"
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
                <span v-text="$configBus.getPrice(choice) >= 0 ? '+ ' : '– '" />
                {{ $configBus.formatPrice(choice.price) }}
              </span>
            </label>

            <Loader
              v-if="loading === choice.name"
              type="inline" />

            <template
              v-else-if="selected === choice.name && chosenOptions">
              <recursive-form
                v-for="subOption in chosenOptions"
                :key="choice.name + '_' + subOption.name"
                :option="subOption"
                :class="`myparcel-checkout__${option.name}--${choice.name}__options`"
                :loading="loading" />
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
import Loader from '@/components/Loader';
import PickupOption from './PickupOption';
import { PICKUP, formConfig, DELIVERY } from '@/config/formConfig';

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
       */
      loading: false,

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
    strings() {
      return this.$configBus.strings;
    },

    config() {
      return this.$configBus.config;
    },

    hasChoices() {
      return this.option.hasOwnProperty('choices') && !!this.option.choices && !!this.option.choices.length;
    },

    validChoices() {
      return this.option.type === 'select' ? false : this.option.choices;
    },

    hasDependency() {
      return this.option.hasOwnProperty('dependency');
    },

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
     *
     * @param {*} value - New value for current option.
     */
    selected(value) {
      this.$configBus.$emit('update', {
        name: this.option.name,
        value,
      });
    },
  },

  created() {
    if (this.hasDependency) {
      this.$configBus.$on('afterUpdate', this.updateDependency);
    } else {
      this.setSelected();
    }
  },

  beforeDestroy() {
    if (this.hasDependency) {
      this.$configBus.$off('afterUpdate', this.updateDependency);
    }
  },

  methods: {
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

          if (needles.length > 0) {
            result = this.getDep(dependencies[needle][values[needle]], needles);
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
      if (dependencyName !== name) {
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
     * Set default chosen value to either the previously set value for the current option, the option that has a
     * 'selected' attribute or the first option.
     */
    setSelected() {
      this.selected = this.$configBus.getSelected(this.option);
    },
  },
};
</script>
