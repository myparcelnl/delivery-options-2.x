<template>
  <div class="prism">
    <prism
      :code="code"
      :language="language" />
  </div>
</template>
<script>
import Prism from 'vue-prismjs';

export default {
  name: 'Prism',
  components: {
    Prism,
  },
  props: {
    code: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: 'js',
    },
  },
};
</script>
