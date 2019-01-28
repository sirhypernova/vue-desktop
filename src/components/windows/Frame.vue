<template>
    <window title="Frame" :close="true" :parent="parseInt(pid)" :resizable="true" :width="width" :height="height" :title-mouse-down="click" :title-mouse-up="unclick">
        <div v-if="dragging" class="dragging"></div>
        <iframe :src="url" frameborder="0"></iframe>
    </window>
</template>

<script>
    export default {
        name: 'FrameWindow',
        props: ['pid'],
        data() {
            return {
                name: 'FrameWindow',
                url: '',
                width: window.innerWidth/1.5,
                height: window.innerHeight/1.25,
                dragging: false
            }
        },
        mounted() {
            this.url = this.$store.state.activeWindows[this.pid].windowSettings.url;
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