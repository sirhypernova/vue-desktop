<template>
    <v-bottom-nav absolute :value="true" color="black" :active.sync="active" class="text-xs-right">
        <v-layout>
            <homebutton></homebutton>
            <taskbaritem v-for="(window,active) in windows" :key="active" :pid="parseInt(window.pid)" :window="window"></taskbaritem>
            <TaskbarClock></TaskbarClock>
        </v-layout>
    </v-bottom-nav>
</template>

<script>
    import TaskbarClock from '@/components/TaskbarClock';

    export default {
        name: 'taskbar',
        data() {
            return {}
        },
        computed: {
            windows() {
                var data = this.$store.state.activeWindows;
                var newWindows = {};
                for (var key in data) {
                    newWindows[data[key].active] = data[key];
                }
                return newWindows;
            },
            active: {
                get() {
                    return this.$store.state.activeApp;
                },
                set(app) {
                    this.$store.commit('setActiveApp',app);
                }
            }
        },
        components: {
            TaskbarClock
        }
    }
</script>

<style scoped>
    .icon {
        font-size: 50px;
    }
    .v-bottom-nav {
        overflow: hidden !important;
        z-index: 2147483646;
    }
</style>