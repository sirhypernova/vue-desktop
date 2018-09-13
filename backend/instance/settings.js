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
        this.api.db('desktop').update(updateData).where('id',data.id).then();
        this.socket.broadcast.to(this.socket.handshake.session.user.id).emit('updateIcon',data);
    },
    removeIcon(id) {
        if (id == undefined || typeof id != 'number') return;
        this.api.db('desktop').where('id',id).del().then();
        this.socket.broadcast.to(this.socket.handshake.session.user.id).emit('removeIcon',id);
    }
}