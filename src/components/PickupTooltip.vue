<template>
  <div
    v-if="show"
    class="myparcel-checkout__tooltip__content">
    <div
      class="myparcel-checkout__tooltip__close"
      @click="$emit('close')">
      <font-awesome-icon icon="times" />
    </div>
    <table>
      <tr>
        <td colspan="2">
          <h3 v-text="data.location" />
        </td>
      </tr>
      <tr>
        <td>
          <span v-text="data.street + ' ' + data.number" /><br>
          <span v-text="data.postal_code + ' ' + data.city" />

          <template v-if="!!data.phone_number">
            <br>
            <span v-text="data.phone_number" />
            <br>
          </template>

          <br>
          <span v-text="strings.pickUpFrom + ' ' + data.start_time.substr(0,5)" />
        </td>
        <td>
          <img
            class="myparcel-checkout__image myparcel-checkout__image--lg myparcel-checkout__float-right"
            :src="carrierData.image"
            alt="">
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <h3 v-text="strings.openingHours" />
        </td>
      </tr>
      <tr
        v-for="day in Object.keys(openingHours)"
        :key="day">
        <td>
          <span v-text="strings[day]" />
        </td>
        <td>
          <span
            class="myparcel-checkout__float-right"
            v-text="openingHours[day]" />
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import { CARRIER_POSTNL } from '@/config/formConfig';

export default {
  name: 'PickupTooltip',
  props: {
    data: {
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    config() {
      return this.$configBus.config;
    },

    strings() {
      return this.$configBus.textToTranslate;
    },

    carrierData() {
      return this.$configBus.getCarrier(this.data.carrier || CARRIER_POSTNL);
    },

    /**
     * Return opening hours with "closed" string from config where needed.
     *
     * @returns {Object}
     */
    openingHours() {
      const openingHours = this.data.opening_hours;
      return Object.keys(this.data.opening_hours).reduce((acc, item) => {
        if (!openingHours[item].length > 0) {
          openingHours[item] = [this.strings.closed];
        }

        return {
          ...acc,
          [item]: openingHours[item][0],
        };
      }, {});
    },
  },
};
</script>
