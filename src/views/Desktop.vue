<template>
  <div :style="desktopStyle">
    <login>
      <desktopgrid></desktopgrid>
      <component v-for="(window,pid) in windows" :key="pid" :is="window.component" :pid="pid"></component>
      <taskbar></taskbar>
    </login>
  </div>
</template>

<script>
  import Login from '@/views/Login';
  import DesktopGrid from '@/components/DesktopGrid';

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
        return `width: 100%; height: 100%; transition: 0.5s; background-color: ${this.$store.state.background == 'default' ? '#42A5F5' : this.$store.state.background}`;
      },
      windows() {
          return this.$store.state.activeWindows;
      },
    },
    components: {
      login: Login,
      desktopgrid: DesktopGrid
    }
  }
</script>

<style>
html, body {
  overflow: hidden !important;
}
</style>