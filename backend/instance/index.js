const Connection = require('./connection');
const fs = require('fs');

module.exports = class DesktopAPI {
    constructor(config = {port: 8080,ip: '0.0.0.0'}) {
        this.app = require('express')();
        this.http = require('http').Server(this.app);
        var io = this.io = require('socket.io')(this.http);
        
        this.config = config;
        this.connections = {};
        
        io.on('connection', (socket) => {
            this.connections[socket.id] = new Connection(socket,this);
        });

        if (!fs.existsSync('instance/programs.js')) {
            fs.writeFileSync('instance/programs.js','module.exports = [];');
        }
    }
    
    setupSessions() {
        var session = require('express-session');
        var SQLiteStore = require('connect-sqlite3')(session);
        
        var mainSession = session({
            store: new SQLiteStore,
            secret: this.sessionKey,
            resave: false,
            saveUninitialized: true,
            name: 'vdsess',
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
        });
        
        var sharedsession = require("express-socket.io-session");
        
        this.app.use(mainSession);
        this.io.use(sharedsession(mainSession,{autoSave: true}));
        
        this.app.use((req,res,next) => {
            res.header("Access-Control-Allow-Credentials", 'true');
            res.header("Access-Control-Allow-Origin", req.headers.origin);
            
            next();
        });
        
        this.app.get('/',(req,res) => {
            res.sendStatus(200);
        });

        const proxy = require('http-proxy').createProxyServer({ws: true});
        proxy.on('error',(err,req,res) => {
            if (res.send) res.send('Invalid Port');
        });
        this.app.use('/proxy/:port',(req,res,next) => {
            if (!req.session.user) return res.sendStatus(403);
            if (!req.params.port) return res.send('Invalid Port');
            if (isNaN(Number(req.params.port))) return res.send('Invalid Port');
            let port = parseInt(req.params.port);
            if (port < 4000 || port > 5000) return res.send('Invalid Port');
            req.port = port;
            proxy.web(req,res,{target: 'http://localhost:'+port+'/'});
        });

        this.http.on('upgrade',(req,res) => {
            if (req.url.startsWith('/proxy/')) {
                let split = req.url.split('/');
                if (!split[2]) return;
                if (isNaN(Number(split[2]))) return;
                let port = parseInt(split[2]);
                if (port < 4000 || port > 5000) return;
                proxy.ws(req,res,{target: 'http://localhost:'+port+'/'});
            }
        });
    }
    
    setupDatabase() {
        return new Promise((resolve,reject) => {
            this.db = require('knex')({
              client: 'sqlite3',
              connection: {
                filename: './api.db'
              },
              useNullAsDefault: true
            });
            
            this.db.schema.hasTable('users').then(exists => {
                if (exists) return;
                
                this.db.schema.createTable('users', function (table) {
                    table.increments(); // integer id
        
                    // Username
                    table.string('username');
        
                    // Password
                    table.string('password');
                }).then(() => {
                    require('bcrypt').hash('admin',10).then(hash => {
                        this.db.insert({username: 'admin', password: hash}).into('users').then(id => {
                            this.db.insert({key: 'background', value: 'default', user: id[0]}).into('config').then();
                            this.db.insert({key: 'admin', value: 'true', user: id[0]}).into('config').then();
                        })
                    })
                });
            })
            
            this.db.schema.hasTable('config').then(exists => {
                if (exists) {
                    this.db.select('*').from('config').where('key','sessionKey').then(rows => rows[0].value)
                    .then(sessionKey => {
                        this.sessionKey = sessionKey;
                        resolve();
                    });
                    return;
                }
                
                this.db.schema.createTable('config',(table) => {
                    table.increments();
                    
                    table.string('key');
                    
                    table.string('value');
                    
                    table.integer('user');
                }).then(() => {
                    this.sessionKey = require('nanoid')(32);
                    this.db.insert({key: 'sessionKey', value: this.sessionKey}).into('config').then();
                    resolve();
                });
            });
            
            this.db.schema.hasTable('desktop').then(exists => {
                if (exists) return;
                this.db.schema.createTable('desktop',(table) => {
                    table.increments();
                    
                    table.string('type');
                    table.string('app');
                    table.integer('x');
                    table.integer('y');
                    table.integer('user');
                }).then(() => {
                    this.db.insert({type: 'app', app: 'SettingsWindow',x: 0, y: 0, user: 1}).into('desktop').then();
                });
            });
        })
        
    }
    
    start(port = this.config.port,ip = this.config.ip) {
        return new Promise((resolve,reject) => {
            this.setupDatabase().then(() => {
                this.setupSessions();
                
                this.config.port = port;
                this.config.ip = ip;
                this.http.listen(port,ip,resolve);
            })
        })
    }
}