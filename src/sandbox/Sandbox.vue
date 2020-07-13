<template>
  <transition-group name="fade">
    <PreLoader
      v-if="loading"
      :key="'preloader'" />
    <template v-else>
      <SandboxHeader :key="'header'" />
      <SandboxIntroduction :key="'intro'" />
      <SandboxSettings :key="'settings'" />
      <SandboxFooter :key="'footer'" />
    </template>
  </transition-group>
</template>

<script>
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';

export default {
  name: 'Sandbox',

  components: {
    PreLoader: () => import(/* webpackChunkName: "PreLoader" */'@/sandbox/components/PreLoader'),
    SandboxHeader: () => import(/* webpackChunkName: "SandboxHeader" */'@/sandbox/components/SandboxHeader'),
    SandboxIntroduction: () => import(/* webpackChunkName: "SandboxIntroduction" */'@/sandbox/components/SandboxIntroduction'),
    SandboxSettings: () => import(/* webpackChunkName: "SandboxSettings" */'@/sandbox/components/SandboxSettings'),
    SandboxFooter: () => import(/* webpackChunkName: "SandboxFooter" */'@/sandbox/components/SandboxFooter'),
  },

  data() {
    return {
      loading: true,
    };
  },

  async created() {
    await sandboxConfigBus.fetchCarrierData();
    this.loading = false;
  },
};
</script>
