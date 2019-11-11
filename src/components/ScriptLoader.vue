<template>
  <div>
    <p
      v-for="(script, index) in mutableScripts"
      :key="'dfkljsfljksdkf_'+index"
      v-text="script" />
    <component
      :is="script.is"
      v-for="(script, index) in mutableScripts"
      :key="`script_${script.type}_${index}`"
      v-bind="script.attributes"
      @load="loaded++" />
  </div>
</template>

<script>
export default {
  name: 'ScriptLoader',
  props: {
    scripts: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      loaded: null,
    };
  },

  computed: {
    amount() {
      return this.scripts.length;
    },
    loadedScripts() {
      return this.loaded === this.amount;
    },
    mutableScripts() {
      return this.scripts.map((script) => {
        const isCss = script.endsWith('css');
        const attributes = {};

        if (isCss) {
          attributes.href = script;
          attributes.rel = 'stylesheet';
        } else {
          attributes.src = script;
        }

        return {
          is: isCss ? 'link' : 'script',
          attributes,
        };
      });
    },
  },
  watch: {
    loadedScripts(bool) {
      console.log(`loadedScripts(${bool})`);
      if (bool) {
        this.$emit('loaded');
      }
    },
  },
};
</script>
