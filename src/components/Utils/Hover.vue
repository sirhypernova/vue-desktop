<template>
    <div :style="style" @mouseover="mouseover" @mouseleave="mouseleave">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'HoverUtil',
        props: {
            color: {
                type: String,
                default: () => '#00000025'
            }
        },
        data() {
            return {
                style: {'background-color': '#FFFFFF00'}
            }
        },
        methods: {
            mouseover() {
                this.style['background-color'] = this.color;
            },
            mouseleave() {
                this.style['background-color'] = '#FFFFFF00';
            }
        }
    }
</script>

<style scoped>
    div {
        border-radius: 5px;
        padding: 1px;
        transition: .4s;
    }
</style>