<template>
    <window :title="name" :close="true" :parent="parseInt(pid)" :resizable="true" :width="width" :height="height" :title-mouse-down="click" :title-mouse-up="unclick">
        <v-container v-if="!url.length" fill-height>
            <v-layout align-center>
                <v-progress-linear :indeterminate="true" color="orange lighten-1"></v-progress-linear>
            </v-layout>
        </v-container>
        <div v-if="dragging" class="dragging"></div>
        <iframe :src="url" frameborder="0"></iframe>
    </window>
</template>

<script>
    import config from '@/config';
    import api from '@/api';

    const component = {
        name: 'XpraWindow',
        launchName: 'Xpra',
        windowSettings: {
            name: 'Xpra',
            open: true
        }
    };
    
    export default {
        name: component.name,
        props: ['pid'],
        data() {
            return {
                width: window.innerWidth/1.5,
                height: window.innerHeight/1.25,
                dragging: false,
                url: '',
                port: 0,
                name: 'xpra app'
            }
        },
        mounted() {
            let program = this.$store.state.activeWindows[this.pid].windowSettings.program;
            this.name = this.$store.state.activeWindows[this.pid].windowSettings.name;
            api.startXpraServer(program,port => {
                this.port = port;
                this.url = `//${config.ip}${(config.port ? ':'+config.port: '')}/proxy/${port}/index.html?top_bar=false&bandwidth_limit=none`;
            });
        },
        beforeDestroy() {
            if (this.port !== 0) api.closeXpraServer(this.port);
        },
        methods: {
            click() {
                this.dragging = true;
            },
            unclick() {
                this.dragging = false;
            }
        }
    }
</script>

<style scoped>
    iframe {
        width: 100%;
        height: 100%;
    }

    .dragging {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
</style>