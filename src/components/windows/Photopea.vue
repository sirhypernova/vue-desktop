<template>
    <window title="Photopea" :close="true" :parent="parseInt(pid)" :resizable="true" :width="width" :height="height" :title-mouse-down="click" :title-mouse-up="unclick">
        <div v-if="dragging" class="dragging"></div>
        <iframe :src="url" frameborder="0"></iframe>
    </window>
</template>

<script>
    import store from '@/store/';
    
    const component = {
        name: 'PhotopeaWindow',
        launchName: 'Photopea',
        windowSettings: {
            name: 'Photopea',
            open: true
        }
    }

    store.commit('addMenuApp', {
        name: component.launchName,
        style: {
            color: 'teal',
            icon: 'brush'
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
                width: window.innerWidth/1.5,
                height: window.innerHeight/1.25,
                dragging: false,
                url: 'https://www.photopea.com/'
            }
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