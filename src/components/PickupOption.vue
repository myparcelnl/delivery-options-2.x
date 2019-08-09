<template>
  <div>
    <label
      :for="`myparcel-checkout--${parent.name}--${data.name}`"
      @click="selected ? showTooltip = !showTooltip : null">
      <span class="myparcel-checkout__d--block">

        <font-awesome-icon
          v-if="selected"
          icon="angle-down"
          class="myparcel-checkout__float-right" />
        <span v-text="data.label" />
      </span>

      <span class="myparcel-checkout__d--block">
        <span v-text="$configBus.formatDistance(pickupData.location.distance)" /> – <span v-text="priceText" />
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
        @update="updateConfigBus()" />
    </template>
  </div>
</template>

<script>
import * as EVENTS from '@/config/data/eventConfig';
import { PICKUP, formConfig } from '@/config/data/formConfig';
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
      const minPrice = this.price.concat().sort((price1, price2) => {
        return price1.price > price2.price ? 1 : -1;
      })[0].price;

      if (minPrice === 0) {
        return this.$configBus.strings.free;
      }

      const formattedPrice = this.$configBus.formatPrice(minPrice);

      if (minPrice < 0) {
        return `${formattedPrice} ${this.$configBus.strings.discount}`;
      }

      return `${this.$configBus.strings.from} ${formattedPrice}`;
    },
  },

  watch: {
    selected() {
      if (!this.selected) {
        this.showTooltip = false;
      }
    },
  },
  methods: {
    updateConfigBus(event) {
      this.$configBus.$emit(EVENTS.UPDATE, event);
    },
  },
};
</script>

