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
      background() {
        return this.$store.state.settings.background;
      },
      desktopStyle() {
        return `width: 100%; height: 100%; transition: 0.5s; background-color: ${this.background == 'default' ? '#42A5F5' : this.background}`;
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