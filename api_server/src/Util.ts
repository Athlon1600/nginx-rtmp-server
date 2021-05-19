const config = require('./config').default;
const fs = require('fs');

export class Util {

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
        return this.trimSlashEnd(config.storage) + '/' + this.trimSlashStart(path);
    }

    public static rtmpStreamUrl(name: string) {
        return 'rtmp://' + config.rtmp.host.trim() + '/live/' + this.trimSlashStart(name);
    }

    public static existsSyncAll(paths: Array<string>) {

        let existing = paths.filter(function (path) {
            return fs.existsSync(path);
        });

        return existing.length === paths.length;
    }
}