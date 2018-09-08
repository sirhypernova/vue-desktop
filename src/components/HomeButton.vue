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
              <v-list-tile-title>Username</v-list-tile-title>
              <v-list-tile-sub-title>Data about user</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn
                :class="logout ? 'red--text' : ''"
                icon
                @mouseover="logout = true"
                @mouseleave="logout = false"
                @click="menu = false"
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
    export default {
        name: 'HomeButton',
        data() {
            return {
                menu: false,
                logout: false
            }
        },
        methods: {
            createWindow(data) {
                this.$store.commit('createWindow',data);
            }
        },
        computed: {
            apps() {
                return this.$store.state.menuApps;
            }
        }
    }
</script>