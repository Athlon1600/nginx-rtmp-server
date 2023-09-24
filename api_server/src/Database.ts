import {Pool, ResultSetHeader, RowDataPacket} from "mysql2";
import {Util} from "./Util";
import {CONFIG} from "./config";

const mysql = require('mysql2');

export class Database {

    protected static instance: Database;
    protected pool: Pool;

    private constructor() {

        const dbConfig = CONFIG.database;

        this.pool = mysql.createPool({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: 'streaming',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
    }

    public static getInstance(): Database {

        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public async select<T>(sql: string, parameters?: unknown[]): Promise<T[]> {
        const [rows] = await this.pool.promise().query(sql, parameters);
        return rows as T[];
    }

    // contains affectedRows and lastInsertId properties.
    public async update() {
        // TODO
    }

    async ping(): Promise<boolean> {
        await this.pool.promise().query("SELECT 1");
        return true;
    }

    async checkIfChannelNameAvailable(name: string): Promise<boolean> {

        const [rows, fields] = await this.pool.promise()
            .execute<RowDataPacket[]>("SELECT COUNT(1) AS cnt FROM channels WHERE name = ?", [name]);

        return rows.length && rows[0]["cnt"] == 0;
    }

    async createChannel(name: string): Promise<boolean> {

        if (!await this.checkIfChannelNameAvailable(name)) {
            throw "Channel with name '" + name + "' is not available";
        }

        const sk = Util.generateStreamKey();

        const result = await this.pool.promise()
            .execute<ResultSetHeader>("INSERT INTO channels (created_at, name, stream_key) VALUES (UTC_TIMESTAMP(), ?, ?)", [
                name, sk
            ]);

        return true;
    }

    async createNewStream(name: string, ipAddress: string, streamInfo: string): Promise<void> {
        await this.pool.promise().execute("INSERT INTO streams (name, user_ip, started_at, ffprobe_json) VALUES (?, ?, UTC_TIMESTAMP(), ?)", [
            name, ipAddress, streamInfo
        ]);
    }

    async updateStreamInfo(name: string, bytesIn: number): Promise<void> {

        await this.pool.promise().execute("UPDATE streams SET ended_at = UTC_TIMESTAMP(), bytes_in = ? WHERE name = ?", [
            bytesIn,
            name
        ]);
    }
}