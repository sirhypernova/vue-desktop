module.exports = {
    setBackground(background) {
        if (typeof background != 'string' || background.length > 16 || !background.length) return;
        this.socket.handshake.session.user.config.background = background;
        this.api.db('config').update('value',background).where({user: this.socket.handshake.session.user.id, key: 'background'}).then();
        this.socket.broadcast.to(this.socket.handshake.session.user.id).emit('setBackground',background);
    },
    fetchUserData(callback) {
        if (callback == undefined || typeof callback != 'function') return;
        callback(this.socket.handshake.session.user);
    },
    async fetchUsers(offset = 0, callback) {
        if (callback == undefined || typeof callback != 'function') return;
        if (offset == undefined || typeof offset != 'number') return;
        let config = await this.api.db.select('value').from('config').where({user: this.socket.handshake.session.user.id, key: 'admin'});
        if (!config.length) return callback(false);
        this.api.db.select(['username','id']).from('users').limit(5).offset(offset).then(callback).catch(console.log);
    },
    changePassword({currentPassword, password}, callback) {
        if (callback == undefined || typeof callback != 'function') return;
        if (typeof currentPassword != 'string') return callback('Invalid Data');
        if (typeof password != 'string') return callback('Invalid Data');
        if (!currentPassword.length || currentPassword.length <= 3 || currentPassword.length >= 20) return callback('Incorrect current password');
        if (!password.length || password.length <= 3 || password.length >= 20) return callback('Incorrect new password');
        this.api.db.select('*').from('users').where('id',this.socket.handshake.session.user.id).then(rows => rows[0]).then(user => {
            require('bcrypt').compare(currentPassword,user.password).then(correct => {
                if (!correct) return callback('Incorrect current password');
                require('bcrypt').hash(password,10).then(async hash => {
                    await this.api.db('users').update('password',hash).where('id',this.socket.handshake.session.user.id);
                    callback(true);
                })
            });
        });
    },
    fetchDesktop(callback) {
        if (callback == undefined || typeof callback != 'function') return;
        this.api.db.select('*').from('desktop').where('user',this.socket.handshake.session.user.id).then(rows => {
            callback(rows);
        });
    },
    updateIcon(data) {
        if (data == undefined || typeof data != 'object') return;
        if (data.id == undefined || typeof data.id != 'number') return;
        if (Object.keys(data).length < 2) return;
        var updateData = Object.assign({},data);
        delete updateData.id;
        delete updateData.i;
        delete updateData.w;
        delete updateData.h;
        delete updateData.moved;
        this.api.db('desktop').update(updateData).where('id',data.id).then();
        this.socket.broadcast.to(this.socket.handshake.session.user.id).emit('updateIcon',data);
    },
    addIcon(data) {
        if (data == undefined || typeof data != 'object') return;
        if (data.id == undefined || typeof data.id != 'number') return;
        if (Object.keys(data).length != 6) return;
        this.api.db('desktop').insert(data).where('id',data.id).then();
        this.socket.broadcast.to(this.socket.handshake.session.user.id).emit('updateIcon',data);
    },
    removeIcon(id) {
        if (id == undefined || typeof id != 'number') return;
        this.api.db('desktop').where('id',id).del().then();
        this.socket.broadcast.to(this.socket.handshake.session.user.id).emit('removeIcon',id);
    }
}