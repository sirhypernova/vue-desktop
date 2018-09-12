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
    }
}