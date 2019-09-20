<template>
  <div
    v-if="hasInvalidAddress"
    :class="`${$classBase}__errors`">
    <h4 v-text="$configBus.strings.addressNotFound" />
    <form v-if="hasRetry">
      <template v-for="part in requiredAddressParts">
        <p :key="part">
          <label>
            {{ $configBus.strings[part] }}
            <input
              v-model="values[part]"
              :name="part + '-input'"
              type="text"
              :placeholder="$configBus.strings[part]"
              v-text="$configBus.strings[part]">
          </label>
        </p>
      </template>
      <button
        @click.prevent="retry()"
        v-text="$configBus.strings.retry" />
    </form>
  </div>
</template>

<script>
import * as EVENTS from '@/config/data/eventConfig';
import { ADDRESS_ERROR } from '@/config/data/errorConfig';
import { FEATURE_ALLOW_RETRY } from '@/config/data/settingsConfig';
import { addressRequirements } from '@/config/data/platformConfig';

export default {
  name: 'Errors',
  data() {
    return {
      values: { ...this.$configBus.address },
    };
  },
  computed: {
    requiredAddressParts() {
      return addressRequirements[this.$configBus.address.cc];
    },
    hasInvalidAddress() {
      return this.$configBus.errors.find(({ code }) => code === ADDRESS_ERROR);
    },
    hasRetry() {
      return this.$configBus.get(FEATURE_ALLOW_RETRY);
    },
  },
  methods: {
    /**
     * Update the address in the configBus with the new address and send the it to the external platform.
     */
    retry() {
      window.MyParcelConfig.address = { ...this.$configBus.address, ...this.values };

      // Trigger the checkout_in event to make the checkout update.
      document.dispatchEvent(new Event(EVENTS.UPDATE_DELIVERY_OPTIONS));

      // Send the new values in an event. It's up to the external platform to do handle this event or not.
      document.dispatchEvent(new CustomEvent(EVENTS.UPDATED_ADDRESS, { detail: this.values }));

      // Hide the modal
      this.$configBus.showModal = false;
    },
  },
};
</script>
