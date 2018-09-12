<template>
    <div>
        <v-fade-transition>
            <div v-if="!loggedIn || !socketConnected">
                <v-container fluid fill-height style="height: 100vh">
                    <v-layout align-center justify-center>
                        <v-card class="elevation-12">
                            <v-toolbar dark :color="socketConnected ? 'primary' : 'red'">
                                <v-toolbar-title>Login</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form v-model="valid">
                                    <v-text-field prepend-icon="person" name="login" label="Login" type="text" v-model="login" required @keypress.enter="submit" :rules="rules.login" :disabled="!socketConnected"></v-text-field>
                                    <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password" required @keypress.enter="submit" :rules="rules.password" :disabled="!socketConnected"></v-text-field>
                                </v-form>
                                <h2 v-if="!socketConnected" class="red--text">No connection to socket</h2>
                                <h2 v-if="error.length" class="red--text">{{ error }}</h2>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn :disabled="!valid" @click="submit" :loading="loading" :color="success ? 'success' : 'primary'">Login</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-layout>
                </v-container>
            </div>
        </v-fade-transition>
        <slot v-if="loggedIn && socketConnected"></slot>
    </div>
</template>

<script>
    // eslint-disable-next-line
    import api from '@/api';
    import axios from 'axios';
    import config from '@/config';
    
    axios.defaults.withCredentials = true;
    
    export default {
        name: 'Login',
        data() {
            return {
                valid: false,
                error: '',
                login: '',
                password: '',
                loading: false,
                success: false,
                rules: {
                    login: [
                        v => !!v || 'Login is required',
                        v => (v.length >= 3 && v.length <= 18) || 'Length should be between 3 and 18'
                    ],
                    password: [
                        v => !!v || 'Password is required'
                    ]
                }
            }
        },
        methods: {
            submit() {
                if (!this.valid) return;
                this.loading = true;
                api.login(this.login,this.password, response => {
                    if (typeof response == 'string') {
                        this.loading = false;
                        this.error = response;
                        this.success = false;
                        return;
                    }
                    this.success = true;
                    setTimeout(() => {
                        this.$store.commit('setBackground',response.config.background);
                        this.loggedIn = true;
                        this.success = false;
                        this.error = '';
                        this.login = '';
                        this.password = '';
                        this.loading = false;
                        api.checkLogin();
                    },250);
                });
            }
        },
        mounted() {
            axios.get(`http://${config.ip}:${config.port}`);
            api.checkLogin();
        },
        computed: {
            loggedIn: {
                get() {
                    return this.$store.state.loggedIn;
                },
                set(value) {
                    this.$store.commit('setLoggedIn',value);
                }
            },
            socketConnected() {
                return this.$store.state.socketConnected;
            }
        }
    }
</script>