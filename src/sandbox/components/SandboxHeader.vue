<template>
  <header>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="primary">
      <b-navbar-brand href="#">
        <img
          src="https://assets.myparcel.nl/skin/images/logo-inverse.svg"
          alt="Logo">

        <span
          v-t="'title.main'"
          class="ml-3" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse
        id="nav-collapse"
        is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            v-for="link in externalLinks"
            :key="'link_' + link.text"
            :to="link.link">
            {{ $t(link.text) }}
            <font-awesome-icon
              icon="external-link-alt"
              class="ml-1 small" />
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
export default {
  name: 'SandboxHeader',

  data() {
    return {
      /* eslint-disable vue/max-len,max-len */
      externalLinks: [
        {
          text: 'links.api_documentation',
          link: 'https://myparcelnl.github.io/api/',
        },
        {
          text: 'links.slack',
          link: 'https://join.slack.com/t/myparcel-dev/shared_invite/enQtNDkyNTg3NzA1MjM4LWQ5MWE5MTQ3MDg4YjU5NzdjYjk0OTY1ZDJiYjU5YzJjNzk3Yzk3NGY0OWFkZDU4MDYwZDEyZDlhZTgzOWM1MjI',
        },
      ],
      /* eslint-enable vue/max-len,max-len */
    };
  },
};
</script>
