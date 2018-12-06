<template>
    <component :is="'hsc-window-style-'+type">
      <hsc-window @click.shift.right.prevent.native="minimize"
      @click.native="setActive"
      @click="setActive"
      :title="title"
      :closeButton="close"
      :resizable="resizable"
      :width="width"
      :height="height"
      :minHeight="minHeight"
      :minWidth="minWidth"
      :maxHeight="maxHeight"
      :maxWidth="maxWidth"
      :isScrollable="scrollable"
      :isOpen.sync="xOpen">
        <slot></slot>
      </hsc-window>
    </component>
</template>

<script>
    export default {
        name: 'window',
        props: {
            title: String,
            type: {
                type: String,
                default: () => 'white'
            },
            close: {
                type: Boolean,
                default: () => true
            },
            resizable: {
                type: Boolean,
                default: () => true
            },
            scrollable: {
                type: Boolean,
                default: () => false
            },
            height: {
                type: Number,
                default: function () {
                    return 50;
                }
            },
            width: {
                type: Number,
                default: function () {
                    return 75;
                }
            },
            minHeight: {
                type: Number,
                default: function () {
                    if (this.resizable) {
                        return 50;
                    }
                    return 0;
                }
            },
            minWidth: {
                type: Number,
                default: function () {
                    if (this.resizable) {
                        return 75;
                    }
                    return 0;
                }
            },
            maxHeight: {
                type: Number,
                default: () => 0
            },
            maxWidth: {
                type: Number,
                default: () => 0
            },
            parent: {
                type: Number,
                default: () => 0
            }
        },
        data() {
            return {
                open: true
            }
        },
        methods: {
            minimize(e) {
                if (e.path[0].parentElement.className != "titlebar draggable-handle") return;
                this.$store.commit('setWindowOpen',{pid: this.parent, open: false});
            },
            setActive() {
                this.$store.commit('setActiveApp',this.parent);
            }
        },
        computed: {
          xOpen: {
              get() {
                  if (!this.parent) return this.open;
                  return this.$store.state.activeWindows[this.parent].windowSettings.open;
              },
              set(open) {
                  if (!this.parent) return this.open = open;
                  this.$store.commit('removeWindow',this.parent);
              }
          }
        },
    }
</script>