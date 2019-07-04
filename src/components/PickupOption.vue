<template>
  <div class="myparcel-checkout__pickup__option">
    <label
      :for="`myparcel-checkout--${parent.name}--${data.name}`"
      @click="selected ? showTooltip = !showTooltip : null">
      <span class="myparcel-checkout__d--block">
        <img
          v-if="configBus.isMultiCarrier"
          class="myparcel-checkout__image myparcel-checkout__image--sm"
          :src="carrierData.image"
          :alt="strings[carrierData.label]">

        <font-awesome-icon
          v-if="selected"
          icon="angle-down"
          class="myparcel-checkout__float-right" />
        <span v-text="data.label" />
      </span>

      <span class="myparcel-checkout__d--block">
        <span v-text="distance" /> – <span v-text="`Vanaf ${data.start_time}`" />
      </span>
    </label>

    <PickupTooltip
      :data="data"
      :show="selected && showTooltip"
      @close="showTooltip = false" />

    <template v-if="selected">
      <recursive-form
        v-for="subOption in data.options"
        :key="data.name + '_' + subOption.name"
        :option="subOption"
        :name="data.name"
        :class="`myparcel-checkout__${data.name}--${subOption.name}__options`"
        @update="$emit('update', $event)" />
    </template>
  </div>
</template>

<script>
import { DELIVERY_PICKUP_EXPRESS, DELIVERY_PICKUP_STANDARD } from '../config/formConfig';
import PickupTooltip from './PickupTooltip';
import { configBus } from '../config/configBus';

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
    configBus: () => configBus,
    config: () => configBus.config,
    strings: () => configBus.textToTranslate,
    carrierData() {
      return configBus.getCarrier(this.data.carrier);
    },
    price() {
      return this.data.time.map((time) => {
        let price;

        switch (time.type) {
          case DELIVERY_PICKUP_STANDARD:
            price = configBus.config.pricePickup;
            break;
          case DELIVERY_PICKUP_EXPRESS:
            price = configBus.config.pricePickupExpress;
            break;
        }

        return {
          type: time.type,
          price: price || time.price.amount,
        };
      });
    },
    priceText() {
      const minPrice = this.price.concat().sort((price1, price2) => price1.price > price2.price ? 1 : -1)[0].price;
      const formattedPrice = configBus.formatPrice(minPrice);

      if (minPrice === 0) {
        return 'Gratis';
      } else if (minPrice < 0) {
        return `${formattedPrice} korting`;
      }

      return `Vanaf ${formattedPrice}`;
    },
    distance() {
      let { distance } = this.data;

      let unit = 'm';
      if (distance >= 1000) {
        distance = (distance / 1000).toFixed(1).toString().replace(/\./, ',');
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

