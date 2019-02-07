const os = require('os');

const fp = require('find-free-port');
const child_process = require('child_process');

const stream = require('stream');

const programs = require('./programs');

module.exports = {
    onLoad() {
        this.xpraServers = {};
    },
    async startXpraServer(program,callback) {
        if (program == undefined || callback == undefined) return;
        if (typeof program !== 'string') return;
        if (typeof callback !== 'function') return;
        if (!programs.includes(program)) return;
        let port = await fp(4000,5000);

        this.xpraServers[port] = child_process.spawn('xpra',['--no-daemon','--html=on','--bind-tcp=127.0.0.1:'+port,'--encoding=rgb32','--start="'+program+'"','start'],{
            stdio: ['ignore','pipe','pipe']
        });

        let server = this.xpraServers[port];

        server.stderr.on('data',data => {
            let string = data.toString();
            if (string.includes('xpra is ready.')) {
                callback(port);
            }
        });
        server.on('close',() => {
            if (this.xpraServers.hasOwnProperty(port)) {
                server.unref();
                server.kill('SIGTERM');
            }
        });

        server.on('exit',() => {
            delete this.xpraServers[port];
        });
    },
    closeXpraServer(port) {
        if (!this.xpraServers.hasOwnProperty(port)) return;
        this.xpraServers[port].kill('SIGTERM');
    }
};