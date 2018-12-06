<template>
    <v-btn v-if="pid" dark color="error" slot="activator" @click="open" :value="window.active">
        <span>{{ window.windowSettings.name }}</span>
        <v-icon size="25" color="teal">{{ window.style.icon }}</v-icon>
    </v-btn>
</template>

<script>
    export default {
        name: 'TaskbarItem',
        props: {
            pid: Number,
            window: {
                type: Object,
                default: () => {return {}}
            }
        },
        methods: {
            open() {
                if (!(this.pid in this.$store.state.activeWindows)) return;
                if (this.isActive && this.isOpen) return this.isOpen = false;
                if (this.isOpen) {
                    this.isOpen = false;
                }
                this.$store.commit('setActiveApp',this.pid);
                setTimeout(() => {
                    this.isOpen = true;
                },1)
            }
        },
        mounted() {
            this.$store.commit('setActiveApp',this.pid);
        },
        computed: {
          isOpen: {
              get() {
                  return this.$store.state.activeWindows[this.pid].windowSettings.open;
              },
              set(open) {
                  this.$store.commit('setWindowOpen',{pid: this.pid, open: open});
              }
          },
          isActive() {
              return this.$store.state.activeApp == this.window.active;
          }
        }
    }
</script>