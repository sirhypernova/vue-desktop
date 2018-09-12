import config from '@/config';
import Connection from './connection';

export default new Connection(config.ip,config.port);