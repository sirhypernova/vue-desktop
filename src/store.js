import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: 'Vue Desktop',
    background: 'default',
    menuApps: {},
    activeWindows: {},
    activeApp: 0,
    maxActive: 1,
    loggedIn: false,
    username: '',
    socketConnected: false,
    desktopIconsView: []
  },
  mutations: {
    setTitle(state,title) {
      state.title = title;
    },
    setBackground(state,data) {
      state.background = data;
      api.setBackground(data);
    },
    setBackgroundLocal(state,data) {
      state.background = data;
    },
    addMenuApp(state,data) {
      state.menuApps[data.component] = {
        name: data.name,
        style: data.style,
        component: data.component,
        windowSettings: data.windowSettings
      };
    },
    clearApps(state) {
      state.activeWindows = {};
      state.activeApp = 0;
      state.maxActive = 1;
    },
    createWindow(state,data) {
      if (data.pid && data.pid in state.activeWindows) {
        state.activeWindows[data.pid].windowSettings.open = true;
        return;
      }
      var pid;
      (function setPid() {
        pid = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        if (pid in state.activeWindows) setPid();
      })();
      Vue.set(state.activeWindows,pid,{component: data.component, windowSettings: Object.assign({},data.windowSettings), style: data.style, pid: pid, active: state.maxActive++});
    },
    removeWindow(state,name) {
      if (name in state.activeWindows) {
        Vue.delete(state.activeWindows,name);
      }
    },
    setWindowOpen(state,data) {
      if (!(data.pid in state.activeWindows)) return;
      state.activeWindows[data.pid].windowSettings.open = data.open;
    },
    setActiveApp(state,pid) {
      if (!(pid in state.activeWindows)) return;
      state.activeApp = state.activeWindows[pid].active;
    },
    setLoggedIn(state,loggedIn) {
      state.loggedIn = loggedIn;
    },
    setUsernameLocal(state,username) {
      state.username = username;
    },
    socketConnected(state,value) {
      state.socketConnected = value;
    },
    updateIconsView(state,data) {
      state.desktopIconsView = data;
    },
    updateIconView(state,data) {
      data.i = data.id;
      data.w = 1;
      data.h = 1;
      Vue.set(state.desktopIconsView,data.id-1,data);
    },
    removeIcon(state,id) {
      Vue.delete(state.desktopIconsView,id-1);
    }
  },
  actions: {

  }
})
