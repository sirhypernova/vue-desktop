<template>
    <window title="Terminal" :close="true" :parent="parseInt(pid)" :resizable="true" :minWidth="600" :minHeight="400">
        <div class="background">
            <div :id="'term-'+pid" class="term" :style="style"></div>
            <resize @notify="onresize"></resize>
        </div>
    </window>
</template>

<script>
    import Vue from 'vue';
    import HoverUtil from '@/components/Utils/Hover';
    import store from '@/store';
    import 'xterm/dist/xterm.css';
    import 'vue-resize/dist/vue-resize.css'
    import { Terminal } from 'xterm'
    import * as fit from 'xterm/lib/addons/fit/fit'
    import { ResizeObserver } from 'vue-resize'
    import api from '@/api';
    
    const component = {
        name: 'TerminalWindow',
        launchName: 'Terminal',
        windowSettings: {
            name: 'Terminal',
            open: true
        }
    }
    
    store.commit('addMenuApp', {
        name: component.launchName,
        style: {
            color: 'black',
            icon: 'laptop'
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
                style: {
                    width: '100%',
                    height: '100%',
                }
            }
        },
        mounted() {
            Terminal.applyAddon(fit)
            this.events = new Vue();
            this.term = new Terminal();
            this.term.open(document.getElementById('term-'+this.pid));
            this.term.fit();
            api.createTerminal(this.pid,{cols:this.term.cols,rows:this.term.rows},this.events);
            
            this.term.on('data',data => {
                api.sendTerminalData(this.pid,data);
            });
            
            this.events.$on('data',data => {
                this.term.write(data);
            })
        },
        beforeDestroy() {
            api.closeTerminal(this.pid);
        },
        computed: {
            
        },
        methods: {
            onresize() {
                this.term.fit();
                api.resizeTerminal(this.pid,{cols:this.term.cols,rows:this.term.rows})
            }
        },
        components: {
            hoverutil: HoverUtil,
            resize: ResizeObserver
        }
    }
</script>

<style>
    .xterm-viewport {
        overflow-y: hidden !important;
    }
</style>

<style scoped>
    .background {
        background-color: black;
        height: 100%;
        width: 100%;
    }
</style>