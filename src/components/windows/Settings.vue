<template>
    <window title="Settings" :close="true" :parent="parseInt(pid)" :resizable="false" :width="400" :height="400">
        <component :is="currentScreen" :pid="pid" style="height: 100%;"></component>
    </window>
</template>

<script>
    import HoverUtil from '@/components/Utils/Hover';
    import UserManager from '@/components/windows/Settings/UserManager';
    import MainScreen from '@/components/windows/Settings/MainScreen';
    import EditUser from '@/components/windows/Settings/EditUser';
    import store from '@/store/';
    
    const component = {
        name: 'SettingsWindow',
        launchName: 'Settings',
        windowSettings: {
            name: 'Settings',
            open: true
        }
    }
    
    store.commit('addMenuApp', {
        name: component.launchName,
        style: {
            color: 'grey',
            icon: 'settings'
        },
        component: component.name,
        windowSettings: component.windowSettings
    });
    
    export default {
        name: component.name,
        props: ['pid'],
        data() {
            return {
                name: component.name,
                screens: ['MainScreen','UserManager'],
            }
        },
        computed: {
            currentScreen: {
                get() {
                    return this.$store.state.activeWindows[this.pid].data.currentScreen;
                },
                set(data) {
                    this.$store.commit('setWindowData',{pid: this.pid, key: 'currentScreen',value: data});
                }
            },
            editUser: {
                get() {
                    return this.$store.state.activeWindows[this.pid].data.editUser;
                },
                set(data) {
                    this.$store.commit('setWindowData',{pid: this.pid, key: 'editUser',value: data});
                }
            }
        },
        mounted() {
            this.currentScreen = 'MainScreen';
            this.editUser = false;
        },
        components: {
            hoverutil: HoverUtil,
            UserManager,
            MainScreen,
            EditUser
        }
    }
</script>

<style>
    .window .content {
        height: 100%;
    }
</style>