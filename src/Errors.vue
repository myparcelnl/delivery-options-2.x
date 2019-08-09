<template>
  <div class="myparcel-checkout__errors">
    <template v-if="isMissingAddressPart">
      <h4 v-text="$configBus.strings.addressNotFound" />
      <form v-if="$configBus.config.allowRetry">
        <template v-for="part in requiredAddressParts">
          <p :key="part">
            <label>
              {{ $configBus.strings[part + 'Text'] }}
              <input
                v-model="values[part]"
                :name="part + '-input'"
                type="text"
                :placeholder="$configBus.strings[part + 'Text']"
                v-text="$configBus.strings[part + 'Text']">
            </label>
          </p>
        </template>
        <button
          @click="retry()"
          v-text="$configBus.strings.retry" />
      </form>
    </template>

    <div
      v-else
      class="alert alert-danger mt-2">
      Check de volgende errors:
      <ul>
        <template v-for="(errorData, type) in $configBus.errors">
          <li
            v-for="error in errorData.errors"
            :key="type + '_' + error.code"
            v-text="error.message" />
        </template>
      </ul>
      <hr>
      Of:
      <ul>
        <li v-text="$configBus.strings.addressNotFound" />
        <li v-text="$configBus.strings.wrongHouseNumberPostcode" />
      </ul>
    </div>
  </div>
</template>

<script>
import * as EVENTS from '@/config/data/eventConfig';
import { MISSING_ADDRESS } from '@/config/data/errorConfig';
import { addressRequirements } from '@/config/data/platformConfig';

export default {
  name: 'Errors',
  data() {
    return {
      values: {},
    };
  },
  computed: {
    requiredAddressParts() {
      return addressRequirements[this.$configBus.address.cc];
    },
    isMissingAddressPart() {
      return this.$configBus.errors.hasOwnProperty(MISSING_ADDRESS);
    },
  },
  methods: {
    /**
     * Update the address in the configBus with the new address and send the it to the external platform.
     */
    retry() {
      this.$configBus.address = { ...this.$configBus.address, ...this.values };

      // Trigger the checkout_in event to make the checkout update.
      document.dispatchEvent(new Event(EVENTS.UPDATE_CHECKOUT_IN));

      // Send the new values in an event. It's up to the external platform to do handle this event or not.
      document.dispatchEvent(new CustomEvent(EVENTS.ADDRESS_UPDATED, this.values));
    },
  },
};
</script>
