<template>
    <window title="Plex" :close="true" :parent="parseInt(pid)" :resizable="true" :width="width" :height="height" :title-mouse-down="click" :title-mouse-up="unclick">
        <div v-if="dragging" class="dragging"></div>
        <iframe :src="plexURL" frameborder="0"></iframe>
    </window>
</template>

<script>
    import store from '@/store/';
    import { plexURL } from '@/config';
    
    const component = {
        name: 'PlexWindow',
        launchName: 'Plex',
        windowSettings: {
            name: 'Plex',
            open: true
        }
    }
    
    if (!(plexURL == undefined || typeof plexURL != 'string' || !plexURL.length)) {
        store.commit('addMenuApp', {
            name: component.launchName,
            style: {
                color: 'orange',
                icon: 'music_note'
            },
            component: component.name,
            windowSettings: component.windowSettings
        });
    }
    
    export default {
        name: component.name,
        props: ['pid'],
        data() {
            return {
                name: component.name,
                plexURL: plexURL,
                width: window.innerWidth/1.5,
                height: window.innerHeight/1.25,
                dragging: false
            }
        },
        mounted() {
            if (this.plexURL == undefined || typeof this.plexURL != 'string' || !this.plexURL.length) this.$store.commit('removeWindow',this.pid);
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