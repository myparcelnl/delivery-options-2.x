<template>
  <BJumbotron>
    <BContainer>
      <BRow>
        <BCol>
          <p v-html="$t('main.description')" />

          <p v-html="$t('main.slack_help')" />
        </BCol>
      </BRow>
    </BContainer>
  </BJumbotron>
</template>

<script>
export default {
  name: 'SandboxIntroduction',
};
</script>
