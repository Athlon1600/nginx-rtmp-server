const config = require('./config').default;

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
}