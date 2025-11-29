import {RowDataPacket} from "mysql2";

type Nullable<T> = T | null;
type NullablePromise<T> = Promise<Nullable<T>>;

export interface UserSchema {
    id: number;
    createdAt: number;
    updatedAt: number;
    username: string;
    password: Buffer;
    displayName: string;
    isAdmin: boolean;
    authToken: string;
}

type UserSchemaPublic = Omit<UserSchema, "password">

export interface IChannel extends RowDataPacket {
    id: number;
    created_at: Date;
    name: string;
    name_previous: string | null;
    username_last_changed_at: Date;
    auth_key: string;
    stream_key: string;
}

export interface UpdateChannel {
    name?: string;
    title?: string;
    description?: string;
}
