import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: 'Vue Desktop',
    background: localStorage.getItem('background') || 'default',
    menuApps: {},
    activeWindows: {},
    activeApp: 0,
    maxActive: 1,
    credentials: ''
  },
  mutations: {
    setTitle(state,title) {
      state.title = title;
    },
    setBackground(state,data) {
      state.background = data;
      localStorage.setItem('background',data);
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
    setCredentials(state,credentials) {
      state.credentials = credentials;
    }
  },
  actions: {

  }
})
