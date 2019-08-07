<template>
  <div class="myparcel-checkout__errors">
    <div class="alert alert-danger mt-2">
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
export default {
  name: 'Errors',
};
</script>
