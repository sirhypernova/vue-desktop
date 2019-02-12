<template>
    <div>
        <v-icon :size="iconSize-1" :color="color" @dblclick.native="doubleClick" @contextmenu.prevent="$refs.menu.open" style="user-select: none;">{{ icon }}</v-icon>
        <div v-if="showText !== false" :style="textStyle">
            <p>{{showText}}</p>
        </div>
        <vue-context ref="menu">
            <ul>
                <li @click="remove">Remove</li>
            </ul>
        </vue-context>
    </div>
</template>

<script>
    import api from '@/api';
    
    export default {
        name: 'DesktopIcon',
        props: ['icon','color','iconSize','data'],
        methods: {
            doubleClick() {
                if (this.data.type === 'frame') {
                    const windowSettings = {
                        name: 'Frame',
                        open: true,
                        url: this.data.app
                    };
                    const style = {
                        color: 'grey',
                        icon: 'launch'
                    };
                    this.createWindow({component: 'FrameWindow',windowSettings: windowSettings, style: style});
                } else if (this.data.type === 'app' && this.data.app in this.$store.state.menuApps) {
                    const app = this.$store.state.menuApps[this.data.app];
                    this.createWindow({component: app.component,windowSettings: app.windowSettings, style: app.style});
                } else if (this.data.type === 'xpra') {
                    this.createWindow({component: 'XpraWindow',windowSettings: {
                        name: this.data.app,
                        open: true,
                        program: this.data.app
                    },style: {
                        color: 'black',
                            icon: 'personal_video'
                    }});
                }
            },
            remove() {
                api.removeIcon(this.data.id);
                this.$store.commit('removeIcon',this.data.id);
            },
            createWindow(data) {
                this.$store.commit('createWindow',data);
            }
        },
        computed: {
            textStyle() {
                return {
                    textAlign: 'center',
                    maxWidth: '100%',
                    fontSize: `${this.iconSize/4.5}px`
                }
            },
            showText() {
                if (this.data.type === 'xpra') return this.data.app;
                return false;
            }
        }
    }
</script>