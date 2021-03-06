module.exports = class Connection {
    constructor(socket,api) {
        this.socket = socket;
        this.api = api;
        this.terminals = {};

        this.events = [
            require('./settings'),
            require('./terminal'),
            require('./xpra')
        ];
        
        this.bound = false;
        
        socket.on('clientReconnect',this.reconnect.bind(this));
        socket.on('disconnect',this.disconnect.bind(this));
        socket.on('login',this.login.bind(this));
        socket.on('logout',this.logout.bind(this));
        socket.on('isLoggedIn', this.isLoggedIn.bind(this));
        
        console.log(`Socket connected with ID ${socket.id}`);
    }
    
    reconnect() {
        this.isLoggedIn(() => {});
    }
    
    disconnect() {
        console.log(`Socket with ID ${this.socket.id} disconnected`);
        delete this.api.connections[this.socket.id];
        for (var key in this.terminals) {
            this.terminals[key].kill();
        }
    }
    
    login(data,callback) {
        if (this.socket.handshake.session.user) return;
        if (callback == undefined || typeof callback != 'function') return;
        if (typeof data != 'object') return callback('Invalid Data');
        if (Object.keys(data).length != 2) return callback('Invalid Data');
        if (data.login == undefined || data.password == undefined) return callback('Invalid Data');
        if (typeof data.login != 'string') return callback('Invalid Data');
        if (typeof data.password != 'string') return callback('Invalid Data');
        if (!data.login.length || data.login.length >= 20) return callback('Incorrect username or password');
        if (!data.password.length || data.login.length >= 32) return callback('Incorrect username or password');
        this.api.db.select('*').from('users').where('username',data.login).then(rows => rows[0]).then(user => {
            if (user == undefined) return callback('Incorrect username or password');
            require('bcrypt').compare(data.password,user.password).then(correct => {
                if (!correct) return callback('Incorrect username or password');
                this.api.db.select('*').from('config').where('user',user.id).then(rows => {
                    var config = {};
                    rows.forEach(row => {
                        config[row.key] = row.value;
                    });
                    this.socket.handshake.session.user = {username: user.username, id: user.id, config: config};
                    this.socket.handshake.session.save();
                    
                    callback({username: user.username, config: config});
                });
            });
        });
    }
    
    logout(callback) {
        if (callback == undefined || typeof callback != 'function') return;
        if (!this.socket.handshake.session.user) return;
        this.socket.leave(this.socket.handshake.session.user.id);
        delete this.socket.handshake.session.user;
        this.socket.handshake.session.save();
        for (var key in this.terminals) {
            this.terminals[key].kill();
        }
        for (var key in this.xpraServers) {
            this.xpraServers[key].kill('SIGTERM');
        }
        callback();
    }
    
    isLoggedIn(callback) {
        if (callback == undefined || typeof callback != 'function') return;
        callback(!!this.socket.handshake.session.user);
        if (this.socket.handshake.session.user) {
            this.socket.join(this.socket.handshake.session.user.id);
            this.bindEvents();
        }
    }
    
    bindEvents() {
        if (this.bound) return;
        this.bound = true;
        this.events.forEach(event => {
            for (let key in event) {
                if (key === 'onLoad') {
                    event[key].bind(this)();
                    continue;
                }
                this.socket.on(key,(...data) => {
                    let value = event[key];
                    if (!this.socket.handshake.session.user) return;
                    value.bind(this)(...data);
                });
            }
        })
    }
}