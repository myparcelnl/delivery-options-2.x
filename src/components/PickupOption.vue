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
import { FEATURE_PICKUP_SHOW_DISTANCE } from '@/config/data/settingsConfig';
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
      return this.$configBus.get(FEATURE_PICKUP_SHOW_DISTANCE) !== false;
    },

    pickupData() {
      return this.data.pickupData;
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
