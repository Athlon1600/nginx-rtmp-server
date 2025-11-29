import {CONFIG} from "./config";

const fs = require('fs');
const crypto = require("crypto");
const path = require('path');

type ObjectWithStringKeys = { [key: string]: any };

export class Util {

    // created_at => createdAt
    public static snakeToCamel<T extends ObjectWithStringKeys>(obj: T): T {

        let newObject: ObjectWithStringKeys = {};

        Object.keys(obj).forEach((key: string) => {

            const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
            newObject[camelKey] = obj[key];
        });

        return newObject as T;
    }

    // createdAt => created_at
    public static camelToSnake<T extends ObjectWithStringKeys>(obj: T): T {

        let newObject: ObjectWithStringKeys = {};

        Object.keys(obj).forEach((key: string) => {
            const snakeKey = key.replace(/([A-Z])/g, (_, c: string) => {
                return `_${c.toLowerCase()}`;
            });
            newObject[snakeKey] = obj[key];
        });

        return newObject as T;
    }

    public static createDirectoryIfNotExist(fileOrDirectoryPath: string) {

        if (path.extname(fileOrDirectoryPath).length > 0) {
            fileOrDirectoryPath = path.dirname(fileOrDirectoryPath);
        }

        fs.mkdirSync(fileOrDirectoryPath, {
            recursive: true
        });
    }

    public static fixedBuffer(limit: number = 1024) {

        let buffer: string = '';

        return {
            append(data: any) {
                buffer += data;

                if (buffer.length > limit) {
                    buffer = buffer.slice(-limit);
                }
            },
            get() {
                return buffer;
            }
        }
    }

    public static splitArgs = (args: string[]) => {

        const result: string[] = [];

        args.forEach((arg) => {
            const temp = arg.split(' ');
            result.push(...temp);
        });

        return result;
    }

    public static trimSlashStart(str: string) {
        return str.replace(/^\/+/, '');
    }

    public static trimSlashEnd(str: string) {
        return str.replace(/\/+$/, '');
    }

    public static trimSlash(str: string) {
        return this.trimSlashStart(this.trimSlashEnd(str));
    }

    public static storagePath(path: string) {
        return this.trimSlashEnd(CONFIG.storage) + '/' + this.trimSlashStart(path);
    }

    public static rtmpStreamUrl(name: string) {
        return 'rtmp://' + CONFIG.rtmp.host.trim() + '/live/' + this.trimSlashStart(name);
    }

    public static existsSyncAll(paths: Array<string>) {

        let existing = paths.filter(function (path) {
            return fs.existsSync(path);
        });

        return existing.length === paths.length;
    }

    // inclusive, exclusive
    public static randomInteger(min: number, max: number): number {
        return Math.floor(
            Math.random() * (max - min) + min
        )
    }

    public static randomString(length: number = 16, customPrefix: string = ""): string {
        let str = crypto.randomBytes(length * 2).toString('base64');

        str = str.replace(/[^a-z0-9]/ig, "");
        str = customPrefix + str.substring(0, length - customPrefix.length);

        return str;
    }

    // EXACTLY 32 characters long
    public static generateStreamKey(): string {
        const keyPrefix = "live_";
        // TODO: remove similar or close similar looking characters, allow but cnanot start or end with it _,
        // OBS safe limit before it becomes invisible: 46?
        return keyPrefix + this.randomString(32 - keyPrefix.length);
    }

    // must be 4-100 characters long. Letters and numbers only. Cannot start with a number
    public static validateChannelName(name: string): boolean {

        if (typeof name !== 'string') {
            return false;
        }

        // TODO: exclude banned words

        const pattern = /^[a-z][a-z0-9]{3,99}$/;
        return pattern.test(name);
    }
}