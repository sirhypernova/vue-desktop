<template>
    <window title="Add Shortcut" :close="true" :parent="parseInt(pid)" :resizable="false" :width="400" :height="400">
        <v-form v-model="valid">
            <v-select
              :items="types"
              label="Type"
              v-model="type"
              :rules="[v => types.includes(v) || 'Must be '+types.join(' or ')]"
              required
            ></v-select>
            <v-select v-if="type == 'App'"
                :items="appNames"
                label="App Name"
                v-model="realApp"
                :rules="[v => appNames.includes(v) || 'Must be '+appNames.join(' or ')]"
                required
            ></v-select>
            <v-text-field v-if="type == 'Frame'"
                label="Frame URL"
                v-model="url"
                :rules="urlRules"
                required
          ></v-text-field>
          <v-btn :disabled="!valid" @click="add">submit</v-btn>
        </v-form>
    </window>
</template>

<script>
    import HoverUtil from '@/components/Utils/Hover';
    import api from '@/api';
    
    const component = {
        name: 'CreateIconWindow',
        launchName: 'Create Icon',
        windowSettings: {
            name: 'Create Icon',
            open: true
        }
    }
    
    export default {
        name: component.name,
        props: ['pid'],
        data() {
            return {
                name: component.name,
                type: 'App',
                app: '',
                url: '',
                urlRules: [
                    v => !!v || 'Required',
                    v => v.match(/(https?:\/\/[^\s]+)/g) || 'Please provide a valid URL'
                ],
                types: ['App','Frame'],
                valid: false
            }
        },
        methods: {
            add() {
                var x = -1;
                var y = 0;
                var icons = this.$store.state.desktopIconsView;
                var iconID = this.$store.state.desktopIconsView.sort((a,b) => b.id - a.id)[0].id + 1;
                while (x == -1) {
                    for (var i = 1; i < 25; i++) {
                        let icon = icons.filter(ic => ic.x == i && ic.y == y)[0];
                        if (icon == undefined && x == -1) { 
                            x = i;
                        }
                    }
                    if (x == -1) y++;
                }

                var component = this.realApp.split(' ').join() + 'Window';
                var data = {id: iconID, x: x, y: y, type: this.type.toLowerCase(), app: this.type == 'App' ? component : this.url};
                var db = Object.assign(data,{user: 1});
                api.addIcon(db);
                this.$store.commit('updateIconView',data);
                this.$store.commit('removeWindow',this.pid);
            }
        },
        computed: {
            apps() {
                return this.$store.state.menuApps;
            },
            realApp: {
                get() {
                    return this.app || this.appNames[0];
                },
                set(name) {
                    this.app = name;
                }
            },
            appNames() {
                var names = [];
                for (var key in this.apps) {
                    var value = this.apps[key];
                    names.push(value.windowSettings.name);
                }
                return names;
            }
        },
        components: {
            hoverutil: HoverUtil
        }
    }
</script>