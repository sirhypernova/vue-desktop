module.exports = class Connection {
    constructor(socket,api) {
        this.socket = socket;
        this.api = api;
        
        socket.handshake.session.save();
        
        socket.on('disconnect',this.disconnect.bind(this));
        socket.on('login',this.login.bind(this));
        socket.on('isLoggedIn', this.isLoggedIn.bind(this));
        
        console.log(`Socket connected with ID ${socket.id}`);
    }
    
    disconnect() {
        console.log(`Socket with ID ${this.socket.id} disconnected`);
        delete this.api.connections[this.socket.id];
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
                this.socket.handshake.session.user = {username: user.username};
                callback({username: user.username});
            });
        });
    }
    
    isLoggedIn(data,callback) {
        if (callback == undefined || typeof callback != 'function') return;
        callback(!!this.socket.handshake.session.user);
    }
}