import {RowDataPacket} from "mysql2";

export interface IChannel extends RowDataPacket {
    id: number;
    created_at: Date;
    name: string;
    stream_key: string;
}
