<template>
  <div>
    <label
      :for="`myparcel-checkout--${parent.name}--${data.name}`"
      @click="selected ? showModal() : null">
      <span class="myparcel-checkout__d-block">

        <font-awesome-icon
          v-if="selected"
          icon="angle-down"
          class="myparcel-checkout__float-right" />
        <span v-text="data.label" />
      </span>

      <span
        v-if="featurePickupShowDistance"
        class="myparcel-checkout__d-block">
        <span v-text="$configBus.formatDistance(pickupData.location.distance)" />
      </span>
    </label>

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
import PickupDetails from './PickupDetails';

export default {
  name: 'PickupOption',
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
  computed: {
    featurePickupShowDistance() {
      return this.$configBus.config.featurePickupShowDistance !== false;
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
  },

  methods: {
    showModal() {
      this.$configBus.showModal = true;
      this.$configBus.modalData = {
        ...this.pickupData,
        component: PickupDetails,
      };
    },
    updateConfigBus(event) {
      this.$configBus.$emit(EVENTS.UPDATE, event);
    },
  },
};
</script>

