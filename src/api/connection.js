/*global io*/
import store from '@/store/';

export default class Connection {
    constructor(ip,port) {
        this.socket = io(`http://${ip}:${port}`);
        
        this.terminalEvents = {};
        
        this.socket.on('connect',this.connect.bind(this));
        this.socket.on('reconnect',this.reconnect.bind(this));
        this.socket.on('disconnect',this.disconnect.bind(this));
        this.socket.on('setBackground',this.setBackgroundEvent.bind(this));
        this.socket.on('updateIcon',this.updateIconEvent.bind(this));
        this.socket.on('removeIcon',this.removeIconEvent.bind(this));
        this.socket.on('terminalData',this.terminalDataEvent.bind(this));
        this.socket.on('terminalClose',this.terminalCloseEvent.bind(this));
        
        this.setup = true;
    }
    
    reconnect() {
        this.socket.emit('clientReconnect');
    }
    
    connect() {
        store.commit('socketConnected',true);
    }
    
    disconnect() {
        store.commit('socketConnected',false);
    }
    
    login(name,password,callback) {
        this.socket.emit('login',{login: name, password: password},(response) => {
            callback(response);
        });
    }
    
    checkLogin() {
        this.socket.emit('isLoggedIn',response => {
            store.commit('setLoggedIn',response);
            this.fetchUserData(data => {
                store.commit('settings/setBackgroundLocal',data.config.background);
                store.commit('setUsernameLocal',data.username);
                this.setup = false;
            });
        })
    }
    
    logout() {
        this.socket.emit('logout', () => {
            store.commit('setLoggedIn',false);
            store.commit('settings/setBackgroundLocal','default');
        });
    }
    
    setBackground(background) {
        if (this.setup) return;
        this.socket.emit('setBackground',background);
    }
    
    setBackgroundEvent(background) {
        store.commit('settings/setBackgroundLocal',background);
    }

    fetchUsers(callback,offset = 0) {
        this.socket.emit('fetchUsers',offset,callback);
    }

    changePassword(currentPassword,password,callback) {
        this.socket.emit('changePassword',{currentPassword,password},callback);
    }
    
    fetchUserData(callback) {
        this.socket.emit('fetchUserData',callback);
    }
    
    fetchDesktop(callback) {
        this.socket.emit('fetchDesktop',callback);
    }
    
    updateIcon(data) {
        this.socket.emit('updateIcon',data);
    }
    
    updateIconEvent(data) {
        store.commit('updateIconView',data);
    }
    
    removeIconEvent(id) {
        store.commit('removeIcon',id);
    }
    
    removeIcon(id) {
        this.socket.emit('removeIcon',id);
    }
    
    addIcon(data) {
        this.socket.emit('addIcon',data);
    }
    
    createTerminal(pid,size,events) {
        this.socket.emit('createTerminal',parseInt(pid),size);
        this.terminalEvents[pid] = events;
    }
    
    closeTerminal(pid) {
        this.socket.emit('terminalClose',parseInt(pid));
    }
    
    resizeTerminal(pid,size) {
        this.socket.emit('terminalResize',parseInt(pid),size);
    }
    
    sendTerminalData(pid,data) {
        this.socket.emit('terminalData',parseInt(pid),data);
    }
    
    terminalDataEvent(pid,data) {
        this.terminalEvents[pid].$emit('data',data);
    }
    
    terminalCloseEvent(pid) {
        store.commit('removeWindow',pid);
        delete this.terminalEvents[pid];
    }
}