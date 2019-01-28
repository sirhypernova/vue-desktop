<template>
    <v-layout justify-space-between column fill-height>
        <v-layout>
            <v-flex xs-12>
                <h2>Editing <code>{{ editUser.username }}</code></h2>
                <h3 v-if="error" class="red--text">{{error}}</h3>
                <v-form v-model="valid">
                    <v-text-field prepend-icon="person" :disabled="!canEditUsername" label="Username" v-model="editUser.username"></v-text-field>
                    <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password" required @keypress.enter="submit" :rules="rules.password"></v-text-field>
                    <v-text-field prepend-icon="done" name="password" label="Verify Password" id="verifyPassword" type="password" v-model="verifyPassword" required @keypress.enter="submit" :rules="rules.verifyPassword"></v-text-field>

                    <v-text-field prepend-icon="lock" name="password" label="Current Password" id="currentPassword" type="password" v-model="currentPassword" required @keypress.enter="submit" :rules="rules.currentPassword"></v-text-field>
                    <v-btn :disabled="!valid" @click="submit" :loading="loading" color="primary">Save</v-btn>
                </v-form>
            </v-flex>
        </v-layout>
        <div style="text-align: right; width: 100%; margin-bottom: 10px; margin-left: 25px;">
            <v-btn bottom icon right color="light-blue" @click="currentScreen = 'UserManager'"><v-icon>keyboard_backspace</v-icon></v-btn>
        </div>
    </v-layout>
</template>

<script>
    import api from '@/api';

    export default {
        name: "EditUser",
        props: ['pid'],
        data() {
            return {
                currentPassword: '',
                password: '',
                verifyPassword: '',
                valid: false,
                loading: false,
                error: '',
                rules: {
                    password: [
                        v => !!v || 'Password is required',
                        v => (v.length >= 3 && v.length <= 20) || 'Length should be between 3 and 20'
                    ],
                    verifyPassword: [
                        v => !!v || 'Password Verification is required',
                        v => v == this.password || 'Passwords must match'
                    ],
                    currentPassword: [
                        v => !!v || 'Current Password is required',
                        v => (v.length >= 3 && v.length <= 20) || 'Length should be between 3 and 20'
                    ]
                }
            }
        },
        methods: {
            submit() {
                this.loading = true;
                if (this.canEditUsername) {
                        // api.changePassword(this.currentPassword, this.password, (success) => {
                        //     if (success == true) {
                        //         this.currentScreen = 'UserManager'
                        //     } else {
                        //         this.error = success;
                        //         this.loading = false;
                        //     }
                        // });
                } else {
                    api.changePassword(this.currentPassword, this.password, (success) => {
                        if (success == true) {
                            this.currentScreen = 'UserManager'
                        } else {
                            this.error = success;
                            this.loading = false;
                        }
                    });
                }
            }
        },
        computed:{
            canEditUsername() {
                return this.editUser.currentAdmin && this.editUser.username !== this.$store.state.username;
            },
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
            }
        }
    }
</script>

<style scoped>

</style>