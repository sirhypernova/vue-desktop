<template>
    <window title="Settings" :close="true" :parent="parseInt(pid)" :resizable="false" :width="400" :height="400">
        <v-layout row justify-space-between>
            <v-flex xs10>
                <h1>Background Color</h1>
            </v-flex>
            <v-flex xs2>
                <swatches v-model="background" colors="material-basic" popover-to="left" swatch-size="30" show-fallback></swatches>
            </v-flex>
        </v-layout>
    </window>
</template>

<script>
    import store from '@/store';
    
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
            }
        },
        computed: {
            background: {
                get() {
                    return this.$store.state.background;
                },
                set(bg) {
                    this.$store.commit('setBackground',bg);
                }
            }
        },
    }
</script>