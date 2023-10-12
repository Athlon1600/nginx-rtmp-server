import {FieldPacket, Pool, ResultSetHeader, RowDataPacket} from "mysql2";
import {Util} from "./Util";
import {CONFIG} from "./config";
import {IChannel} from "./types";

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
    public async insertGetId(sql: string, parameters?: unknown[]): Promise<number> {

        const [result, fields]: [ResultSetHeader, FieldPacket[]] = await this.pool.promise()
            .query<ResultSetHeader>(sql, parameters);

        return result.insertId;
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

    async createChannel(name: string, ipAddress: string): Promise<boolean> {

        if (!await this.checkIfChannelNameAvailable(name)) {
            throw "Channel with name '" + name + "' is not available";
        }

        const streamKey: string = Util.generateStreamKey();
        const authKey: string = Util.randomString(32, 'ak_');

        const result = await this.insertGetId(
            "INSERT INTO channels (created_at, ip_address, name, auth_key, stream_key) VALUES (UTC_TIMESTAMP(), ?, ?, ?, ?)",
            [ipAddress, name, authKey, streamKey]
        );

        return true;
    }

    async findChannelById(id: number): Promise<IChannel> {
        const result: IChannel[] = await this.select<IChannel>("SELECT * FROM channels WHERE id = ?", [id]);
        return result.length ? result[0] : null;
    }

    async findChannelByAuthToken(token: string): Promise<IChannel | null> {
        const result = await this.select<IChannel>("SELECT * FROM channels WHERE stream_key = ? LIMIT 1", [token]);
        return result.length ? result[0] : null;
    }

    async findChannelByName(name: string): Promise<IChannel> {
        const result: IChannel[] = await this.select<IChannel>("SELECT * FROM channels WHERE name = ? LIMIT 1", [name]);
        return result.length ? result[0] : null;
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