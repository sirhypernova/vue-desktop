<template>
    <div>
        <v-fade-transition>
            <div v-if="!loggedIn">
                <v-container fluid fill-height style="height: 100vh">
                    <v-layout align-center justify-center>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Login</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form v-model="valid">
                                    <v-text-field prepend-icon="person" name="login" label="Login" type="text" v-model="login" required @keypress.enter="submit" :rules="rules.login"></v-text-field>
                                    <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password" required @keypress.enter="submit" :rules="rules.password"></v-text-field>
                                </v-form>
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
        <slot v-if="loggedIn"></slot>
    </div>
</template>

<script>
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
                setTimeout(() => {
                    this.success = true;
                    setTimeout(() => {
                        this.loggedIn = true;
                        this.success = false;
                        this.loading = false;
                        this.login = '';
                        this.password = '';
                    },250);
                },500);
            }
        },
        computed: {
            loggedIn: {
                get() {
                    return this.$store.state.credentials;
                },
                set(credentials) {
                    this.$store.commit('setCredentials',credentials);
                }
            }
        }
    }
</script>