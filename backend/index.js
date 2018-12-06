const API = require('./instance');
const api = new API();

api.start(process.env.PORT,process.env.IP).then(() => {
    console.log(`API listening on ${api.config.ip}:${api.config.port}`);
});