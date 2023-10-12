import {ConnectionOptions} from "mysql2";
import {URL} from "url";

require('dotenv').config();

const urlFromEnv: URL | null = (() => {

    try {
        return new URL(process.env.MYSQL_CONNECTION);
    } catch (e) {
        return null;
    }

})();

const connectionOptions: ConnectionOptions = {
    host: process.env.DB_HOST || urlFromEnv?.hostname || 'localhost',
    port: +(urlFromEnv?.port || 3306),
    user: urlFromEnv?.username || 'root',
    password: urlFromEnv?.password || 'password',
}

export const CONFIG = {
    database: connectionOptions,
    rtmp: {
        host: process.env.RTMP_SERVER || 'rtmp'
    },
    http: {
        host: ''
    },
    storage: process.env.STORAGE || '/var/storage'
};
