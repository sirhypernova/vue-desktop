/*global io*/
import store from '@/store';

export default class Connection {
    constructor(ip,port) {
        this.socket = io(`http://${ip}:${port}`);
        
        this.socket.on('connect',this.connect.bind(this));
        this.socket.on('disconnect',this.disconnect.bind(this));
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
        this.socket.emit('isLoggedIn',null,response => {
            store.commit('setLoggedIn',response);
        })
    }
}