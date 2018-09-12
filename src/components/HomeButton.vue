<template>
    <v-menu v-model="menu" :close-on-content-click="false" nudge-right="20">
      <v-btn dark color="error" slot="activator">
        <v-icon size="35" color="teal">home</v-icon>
      </v-btn>
      <v-card loading>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="http://via.placeholder.com/256/202225/FFFFFF.png?text=Username" alt="Username">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ username }}</v-list-tile-title>
              <v-list-tile-sub-title>Data about user</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn
                :class="clearApps ? 'blue--text' : ''"
                icon
                @mouseover="clearApps = true"
                @mouseleave="clearApps = false"
                @click="clearAllApps"
              >
                <v-icon>clear_all</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn
                :class="logoutRed ? 'red--text' : ''"
                icon
                @mouseover="logoutRed = true"
                @mouseleave="logoutRed = false"
                @click="logout"
              >
                <v-icon>exit_to_app</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list>
            <v-card-title>
                <h3>Applications</h3>
            </v-card-title>
            <v-list-tile v-for="app in apps" :key="app.component">
                <v-btn :color="app.style.color" :class="(app.style.textColor ? app.style.textColor : 'white') + '--text'" @click="menu = false; createWindow({component: app.component,windowSettings: app.windowSettings, style: app.style})" block>
                    <span>{{ app.name }}</span>
                    <v-icon right>launch</v-icon>
                </v-btn>
            </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
</template>

<script>
    import api from '@/api';

    export default {
        name: 'HomeButton',
        data() {
            return {
                menu: false,
                logoutRed: false,
                clearApps: false
            }
        },
        methods: {
            createWindow(data) {
                this.$store.commit('createWindow',data);
            },
            logout() {
                api.logout();
                this.clearAllApps();
            },
            clearAllApps() {
              this.menu = false;
              this.$store.commit('clearApps');
            }
        },
        computed: {
            apps() {
                return this.$store.state.menuApps;
            },
            loggedIn: {
                get() {
                    return this.$store.state.loggedIn;
                },
                set(value) {
                    this.$store.commit('setLoggedIn',value);
                }
            },
            username() {
              return this.$store.state.username;
            }
        }
    }
</script>

<style scoped>
  .v-menu__content {
    z-index: 2147483647;
  }
</style>