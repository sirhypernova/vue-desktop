<template>
    <div>
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
        <hoverutil>
            <v-layout row justify-space-between @click="currentScreen = 'UserManager'" style="cursor: pointer;">
                <v-flex xs10>
                    <h1>User Management</h1>
                </v-flex>
                <v-layout xs2>
                    <v-icon size="50" color="gray">person</v-icon>
                </v-layout>
            </v-layout>
        </hoverutil>
    </div>
</template>

<script>
    import HoverUtil from '@/components/Utils/Hover';

    export default {
        name: "MainScreen",
        props: ['pid'],
        computed: {
            background: {
                get() {
                    return this.$store.state.settings.background;
                },
                set(bg) {
                    this.$store.commit('settings/setBackground',bg);
                }
            },
            currentScreen: {
                get() {
                    return this.$store.state.activeWindows[this.pid].data.currentScreen;
                },
                set(data) {
                    this.$store.commit('setWindowData',{pid: this.pid, key: 'currentScreen',value: data});
                }
            }
        },
        components: {
            hoverutil: HoverUtil,
        }
    }
</script>

<style scoped>

</style>