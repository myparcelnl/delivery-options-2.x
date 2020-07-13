import Vue from 'vue';

/**
 * Add a data-test attribute to an element with 'v-test', but only if the environment is 'test'. If you don't provide a
 *  value in v-test, the vnode's key will be used.
 *
 * @param {Element} el - The element with the v-test attribute.
 * @param {Object} binding - The value for the attribute.
 * @param {import('vue').VNode} vnode
 */
export const vTest = (el, binding, vnode) => {
  let testKey = binding.value || vnode.key;

  if (!testKey && el.id) {
    testKey = el.id.replace(`${Vue.prototype.$classBase}__`, '');
  }

  if (!testKey) {
    throw new Error('Couldn\'t automatically determine a v-test key for this element.');
  }

  el.setAttribute('data-test-id', testKey);
};
