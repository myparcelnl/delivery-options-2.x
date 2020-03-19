<template>
  <pre
    class="card code code--block"
    :class="{
      [`code--${language}`]: language,
      'code--loading': loading,
    }"
    @click="handleClick"
    @mouseover="listeners.mouseOver"
    @mouseout="listeners.mouseOut"
    v-html="codeHtml" />
</template>

<script>
import { CODE_FORMAT_JAVASCRIPT } from '@/sandbox/config/forms/codeFormats';
import debounce from 'lodash-es/debounce';
import { hljs } from '@/sandbox/services/highlightjs';

export default {
  name: 'CCodeDisplay',
  props: {
    loading: Boolean,
    code: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: () => CODE_FORMAT_JAVASCRIPT,
    },
    allowHover: {
      type: Array,
      default: null,
    },
  },

  data() {
    const MOUSE_DEBOUNCE_DELAY = 15;

    return {
      hovered: null,
      listeners: {
        mouseOver: debounce(this.handleMouseOver, MOUSE_DEBOUNCE_DELAY),
        mouseOut: debounce(this.handleMouseOut, MOUSE_DEBOUNCE_DELAY),
      },
    };
  },

  computed: {
    codeHtml() {
      const language = hljs.getLanguage(this.language) ? this.language : 'javascript';
      const content = hljs.highlight(language, this.code).value;

      return `<div class="code__wrapper">${content}</div>`;
    },
  },

  methods: {
    handleClick({ target }) {
      if (target.tagName !== 'SPAN') {
        return;
      }

      this.$emit('click', target);
    },

    handleMouseOver({ target }) {
      const hoverAllowed = this.allowHover && this.allowHover.includes(target.innerText);

      if (!hoverAllowed || target.tagName !== 'SPAN' || target.classList.contains('code--hover')) {
        return;
      }

      this.hovered = target;

      target.classList.add('code--hover');
    },

    handleMouseOut() {
      if (!this.hovered) {
        return;
      }

      this.hovered.classList.remove('code--hover');
      this.hovered = null;
    },
  },
};
</script>
