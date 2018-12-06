const pty = require('node-pty');
const os = require('os');

module.exports = {
    createTerminal(pid,size) {
        if (pid == undefined || size == undefined) return;
        if (!Number.isInteger(pid)) return;
        if (typeof size !== 'object') return;
        if (Object.keys(size).length !== 2) return;
        if (!Number.isInteger(size.cols) || !Number.isInteger(size.rows)) return;
        var ptyProcess = pty.spawn('su', [os.userInfo().username], {
            name: 'xterm-color',
            cols: size.cols || 80,
            rows: size.rows || 30,
            cwd: process.env.HOME,
            env: process.env
        });
        
        this.terminals[pid] = ptyProcess;
        
        ptyProcess.on('data',(data) => {
            this.socket.emit('terminalData',pid,data);
        });
        
        ptyProcess.on('exit',() => {
            this.socket.emit('terminalClose',pid);
            delete this.terminals[pid];
        });
    },
    terminalResize(pid,size) {
        if (pid == undefined || size == undefined) return;
        if (!Number.isInteger(pid)) return;
        if (typeof size !== 'object') return;
        if (Object.keys(size).length !== 2) return;
        if (!Number.isInteger(size.cols) || !Number.isInteger(size.rows)) return;
        if (!(pid in this.terminals)) return;
        var ptyProcess = this.terminals[pid];
        ptyProcess.resize(size.cols,size.rows);
    },
    terminalData(pid,data) {
        if (pid == undefined || data == undefined) return;
        if (!Number.isInteger(pid)) return;
        if (typeof data !== 'string') return;
        if (!(pid in this.terminals)) return;
        var ptyProcess = this.terminals[pid];
        ptyProcess.write(data);
    },
    terminalClose(pid) {
        if (pid == undefined) return;
        if (!Number.isInteger(pid)) return;
        if (!(pid in this.terminals)) return;
        this.terminals[pid].kill();
    }
}