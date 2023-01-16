<template>
  <div id="app">
    <tinymce-text v-model="value" :config="conf"></tinymce-text>

    <div v-html="value"></div>
  </div>
</template>

<script>
import TinymceText from "../package/TinymceText";
export default {
  name: 'App',
  components: {TinymceText},
  data() {
    return {
      value: null,
      conf: {
        files_upload_url: '/file/upload/rich-text',
        images_upload_url: '/file/upload/rich-text',
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
