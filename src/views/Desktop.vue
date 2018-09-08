<template>
  <div :style="desktopStyle">
    <component v-for="(window,pid) in windows" :key="pid" :is="window.component" :pid="pid"></component>
    <taskbar></taskbar>
  </div>
</template>

<script>
  export default {
    mounted() {
      document.title = this.title;
    },
    data() {
      return {
        open: true
      }
    },
    computed: {
      title() {
        return this.$store.state.title;
      },
      desktopStyle() {
        return `width: 100%; height: 100%; background-color: ${this.$store.state.background == 'default' ? '#42A5F5' : this.$store.state.background}`;
      },
      windows() {
          return this.$store.state.activeWindows;
      }
    }
  }
</script>

<style>
html, body {
  overflow: hidden !important;
}
</style>