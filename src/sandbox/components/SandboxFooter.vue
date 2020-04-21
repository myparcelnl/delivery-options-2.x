<template>
  <div class="bg-light container-fluid py-4">
    <div class="row">
      <div class="col-12 col-md-6">
        Currently deployed commit:

        <a
          :href="url + '/commits/' + hash" v-text="hash" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SandboxFooter',

  computed: {
    hash() {
      return process.env.VUE_APP_COMMIT_HASH;
    },
    url() {
      return process.env.VUE_APP_REPOSITORY_URL;
    },
  },
};
</script>
