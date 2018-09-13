<template>
    <window title="Frame" :close="true" :parent="parseInt(pid)" :resizable="true" :width="width" :height="height">
        <iframe :src="url" frameborder="0"></iframe>
    </window>
</template>

<script>
    import store from '@/store';
    import { plexURL } from '@/config';
    
    export default {
        name: 'FrameWindow',
        props: ['pid'],
        data() {
            return {
                name: 'FrameWindow',
                url: '',
                width: window.innerWidth/1.5,
                height: window.innerHeight/1.25
            }
        },
        mounted() {
            this.url = this.$store.state.activeWindows[this.pid].windowSettings.url;
            // if (this.plexURL == undefined || typeof this.plexURL != 'string' || !this.plexURL.length) this.$store.commit('removeWindow',this.pid);
        }
    }
</script>

<style scoped>
    iframe {
        width: 100%;
        height: 100%;
    }
</style>