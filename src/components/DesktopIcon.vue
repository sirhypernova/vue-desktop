<template>
    <v-icon :size="iconSize-1" :color="color" @dblclick.native="doubleClick" @click.right.prevent="rightClick">{{ icon }}</v-icon>
</template>

<script>
    import api from '@/api';
    
    export default {
        name: 'DesktopIcon',
        props: ['icon','color','iconSize','data'],
        methods: {
            doubleClick() {
                if (this.data.type == 'frame') {
                    var windowSettings = {
                        name: 'Frame',
                        open: true,
                        url: this.data.app
                    }
                    var style = {
                        color: 'grey',
                        icon: 'launch'
                    }
                    this.createWindow({component: 'FrameWindow',windowSettings: windowSettings, style: style});
                    return;
                }
                if (this.data.app in this.$store.state.menuApps) {
                    var app = this.$store.state.menuApps[this.data.app];
                    this.createWindow({component: app.component,windowSettings: app.windowSettings, style: app.style});
                    return;
                }
            },
            rightClick() {
                api.removeIcon(this.data.id);
                this.$store.commit('removeIcon',this.data.id);
            },
            createWindow(data) {
                this.$store.commit('createWindow',data);
            }
        },
    }
</script>