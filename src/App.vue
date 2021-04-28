<template>
  <div id="app">
    <tinymce-text v-model="value" :config="conf"></tinymce-text>
  </div>
</template>

<script>
import TinymceText from "../package/TinymceText";
export default {
  name: 'App',
  components: {TinymceText},
  data() {
    return {
      value: '',
      conf: {
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
