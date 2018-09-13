<template>
    <div id="content" style="cursor: default;">
        <grid-layout
                :layout="layout"
                :col-num="colNum"
                :row-height="iconSize"
                :is-draggable="true"
                :is-resizable="false"
                :is-mirrored="false"
                :vertical-compact="false"
                :margin="[3, 3]"
                :use-css-transforms="false"
                :autoSize="false"
                @layout-updated="layoutUpdated"
        >
            <grid-item v-for="icon in layout"
                :key="icon.id"
                :x="icon.x"
                :y="icon.y"
                :w="1"
                :h="1"
                :i="icon.id"
                :style="{width:iconSize+'px'}">
                <desktopicon :iconSize="iconSize-1" :color="getColor(icon)" :icon="getIcon(icon)" :data="icon"></desktopicon>
            </grid-item>
        </grid-layout>
    </div>
</template>

<script>
    import api from '@/api';
    // eslint-disable-next-line
    import VueGridLayout from 'vue-grid-layout';
    import DesktopIcon from '@/components/DesktopIcon';

    export default {
        name: 'DesktopGrid',
        data() {
            return {
                iconSize: 0,
                colNum: 24
            }
        },
        mounted() {
            this.$nextTick(() => {
                window.addEventListener('resize', () => {
                    this.iconSize = Math.floor(window.innerWidth/this.colNum);
                });
                this.iconSize = Math.floor(window.innerWidth/this.colNum);
            });
            api.fetchDesktop(desktop => {
                desktop.forEach((val,index) => {
                    val.i = val.id;
                    val.w = 1;
                    val.h = 1;
                });
                this.layout = desktop;
            })
        },
        methods: {
            layoutUpdated(layout) {
                layout.forEach(val => {
                    api.updateIcon({id: val.id, x: val.x, y: val.y});
                })
            },
            getIcon(data) {
                if (data.type == 'frame') return 'launch';
                if (data.type == 'app') {
                    if (data.app in this.$store.state.menuApps) return this.$store.state.menuApps[data.app].style.icon;
                }
                return 'launch';
            },
            getColor(data) {
                if (data.type == 'frame') return 'teal';
                if (data.type == 'app') {
                    if (data.app in this.$store.state.menuApps) return this.$store.state.menuApps[data.app].style.color;
                }
                return 'teal';
            }
        },
        computed: {
            layout: {
                get() {
                    return this.$store.state.desktopIconsView;
                },
                set(icons) {
                    console.log(icons);
                    this.$store.commit('updateIconsView',icons);
                }
            }
        },
        components: {
            desktopicon: DesktopIcon
        }
    }
</script>

<style>
#content {
    width: 100%;
    height: calc(100% - 56px) !important;
}

.vue-grid-layout {
    height: calc(100% - 56px) !important;
}

.vue-grid-item:hover {
    background: #FFFFFF50;
    border: 1px solid #00000050;
    border-radius: 3px;
}

.vue-grid-item.static {
    background: #cce;
}

.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}
</style>