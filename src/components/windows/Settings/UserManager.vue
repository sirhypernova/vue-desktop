<template>
    <div>
        <v-layout justify-space-between column fill-height>
                <v-layout>
                    <v-flex xs-12>
                        <v-layout row>
                            <v-flex xs10>
                                <h2>Users</h2>
                            </v-flex>
                            <v-flex xs2 style="text-align: right;" v-if="admin">
                                <v-btn color="cyan" @click="noop" small icon><v-icon color="white">add</v-icon></v-btn>
                            </v-flex>
                        </v-layout>
                        <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
                        <v-list>
                            <v-list-tile v-for="user in users" :key="user.username">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ user.username }}</v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-hover>
                                        <v-icon slot-scope="{ hover }" @click="edit(user)" :color="hover ? 'blue darken-2' : 'blue lighten-1'">edit</v-icon>
                                    </v-hover>
                                </v-list-tile-action>
                                <v-list-tile-action v-if="admin">
                                    <v-hover>
                                        <v-icon :disabled="user.username == username" slot-scope="{ hover }" @click="noop" :color="hover ? 'red darken-2' : 'red lighten-1'">delete</v-icon>
                                    </v-hover>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>
                    </v-flex>
                </v-layout>
                <div style="text-align: right; width: 100%; margin-bottom: 10px; margin-left: 25px;">
                    <v-btn bottom icon right color="light-blue" @click="currentScreen = 'MainScreen'"><v-icon>keyboard_backspace</v-icon></v-btn>
                </div>
        </v-layout>
    </div>
</template>

<script>
    import api from '@/api';

    export default {
        name: "UserManager",
        props: ['pid'],
        data() {
            return {
                users: [],
                admin: true,
                loading: true
            }
        },
        mounted() {
            api.fetchUsers(users => {
                this.loading = false;
                if (users === false) {
                    this.admin = false;
                    this.users.push({username: this.$store.state.username});
                    return;
                }
                this.users = users;
            })
        },
        computed:{
            currentScreen: {
                get() {
                    return this.$store.state.activeWindows[this.pid].data.currentScreen;
                },
                set(data) {
                    this.$store.commit('setWindowData',{pid: this.pid, key: 'currentScreen',value: data});
                }
            },
            editUser: {
                get() {
                    return this.$store.state.activeWindows[this.pid].data.editUser;
                },
                set(data) {
                    this.$store.commit('setWindowData',{pid: this.pid, key: 'editUser',value: data});
                }
            },
            username() {
                return this.$store.state.username;
            }
        },
        methods: {
            noop() {},
            edit(user) {
                this.editUser = {...user, currentAdmin: this.admin};
                this.currentScreen = 'EditUser';
            }
        }
    }
</script>

<style>

</style>