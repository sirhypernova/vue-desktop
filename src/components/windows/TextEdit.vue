<template>
    <window title="Settings" :close="true" :parent="parseInt(pid)" :resizable="true" :width="400" :height="400">
        <hoverutil>
            <v-layout row justify-space-between>
                <v-flex xs10>
                    <swatches v-model="background" colors="material-basic" popover-to="right" swatch-size="30" show-fallback>
                        <h1 slot="trigger">Background Color</h1>
                    </swatches>
                </v-flex>
                <v-flex xs2>
                    <swatches v-model="background" colors="material-basic" popover-to="left" swatch-size="30" show-fallback></swatches>
                </v-flex>
            </v-layout>
        </hoverutil>
    </window>
</template>

<script>
    import HoverUtil from '@/components/Utils/Hover';
    import store from '@/store';
    
    const component = {
        name: 'NotepadWindow',
        launchName: 'Notepad',
        windowSettings: {
            name: 'Notepad',
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
        components: {
            hoverutil: HoverUtil
        }
    }
</script>