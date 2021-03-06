<template>
    <div id="content" style="cursor: default;" @contextmenu.prevent.capture="$refs.menu.open">
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
        <vue-context ref="menu">
            <ul>
                <li @click="addShortcut">Add Shortcut</li>
            </ul>
        </vue-context>
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
                desktop.forEach((val) => {
                    val.i = val.id;
                    val.w = 1;
                    val.h = 1;
                });
                this.layout = desktop;
            })
        },
        methods: {
            addShortcut() {
                this.$store.commit('createWindow',{component: 'CreateIconWindow',windowSettings: {name: 'Add Shortcut', open: true}, style: {icon: 'create'}});
            },
            layoutUpdated(layout) {
                layout.forEach(val => {
                    var ico = layout.filter(icon => icon.id == val.id)[0];
                    var index = layout.indexOf(ico);
                    var update = Object.assign(this.$store.state.desktopIconsView[index],{x: val.x, y: val.y})
                    api.updateIcon(update);
                })
            },
            getIcon(data) {
                if (data.type === 'frame') return 'launch';
                if (data.type === 'app') {
                    if (data.app in this.$store.state.menuApps) return this.$store.state.menuApps[data.app].style.icon;
                }
                if (data.type === 'xpra') {
                    return 'personal_video';
                }
                return 'launch';
            },
            getColor(data) {
                if (data.type === 'frame') return 'teal';
                if (data.type === 'app') {
                    if (data.app in this.$store.state.menuApps) return this.$store.state.menuApps[data.app].style.color;
                }
                if (data.type === 'xpra') {
                    return 'blue';
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
                    this.$store.commit('updateIconsView',icons);
                }
            }
        },
        components: {
            desktopicon: DesktopIcon,
        }
    }
</script>

<style>
#content {
    width: 100%;
    height: calc(100vh - 56px) !important;
}

.vue-grid-layout {
    height: 100% !important;
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