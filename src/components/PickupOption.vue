<template>
  <div>
    <label
      :for="`myparcel-checkout--${parent.name}--${data.name}`"
      @click="selected ? showTooltip = !showTooltip : null">
      <span class="myparcel-checkout__d--block">
        <img
          v-if="$configBus.isMultiCarrier"
          class="myparcel-checkout__image myparcel-checkout__image--sm"
          :src="data.image"
          :alt="strings[data.label]">

        <font-awesome-icon
          v-if="selected"
          icon="angle-down"
          class="myparcel-checkout__float-right" />
        <span v-text="data.label" />
      </span>

      <span class="myparcel-checkout__d--block">
        <span v-text="distance" /> – <span v-text="priceText" />
      </span>
    </label>

    <PickupTooltip
      :data="pickupData"
      :show="selected && showTooltip"
      @close="showTooltip = false" />

    <template v-if="selected">
      <recursive-form
        v-for="subOption in data.options"
        :key="data.name + '_' + subOption.name"
        :option="subOption"
        :name="data.name"
        @update="$emit('update', $event)" />
    </template>
  </div>
</template>

<script>
import { PICKUP, formConfig } from '@/config/formConfig';
import PickupTooltip from './PickupTooltip';

export default {
  name: 'PickupOption',
  components: { PickupTooltip },
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Object,
      default: null,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showTooltip: false,
    };
  },
  computed: {
    config() {
      return this.$configBus.config;
    },

    strings() {
      return this.$configBus.strings;
    },

    pickupData() {
      return this.data.pickupData;
    },

    carrierData() {
      return this.$configBus.getCarrier(this.data.carrier);
    },

    price() {
      return this.pickupData.possibilities.map((time) => {
        const type = time.delivery_type_name;

        return {
          type,
          price: this.$configBus.getPrice(formConfig[PICKUP].options[type]),
        };
      });
    },

    /**
     * Get a formatted string for the minimum price.
     *
     * @returns {string}
     */
    priceText() {
      const minPrice = this.price.concat().sort((price1, price2) => (price1.price > price2.price ? 1 : -1))[0].price;

      if (minPrice === 0) {
        return this.$configBus.strings.free;
      }

      const formattedPrice = this.$configBus.formatPrice(minPrice);

      if (minPrice < 0) {
        return `${formattedPrice} ${this.$configBus.strings.discount}`;
      }

      return `${this.$configBus.strings.from} ${formattedPrice}`;
    },

    /**
     * Format the distance to the pickup location in m or km depending on amount of meters.
     *
     * @returns {string}
     */
    distance() {
      let { distance } = this.pickupData.location;
      const mToKm = 1000;

      let unit = 'm';
      if (distance >= mToKm) {
        distance = (distance / mToKm).toFixed(1).toString().replace(/\./, ',');
        unit = 'km';
      }

      return distance + unit;
    },
  },

  watch: {
    selected() {
      if (!this.selected) {
        this.showTooltip = false;
      }
    },
  },
};
</script>

