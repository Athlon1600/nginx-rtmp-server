import {EOL} from "os";

const os = require('os');

export class M3u8 {

    protected variants: Array<any> = [];

    addVariant(path: string, name: string, bandwidth: number) {

        this.variants.push([
            path, name, bandwidth
        ]);
    }

    toString() {

        let str = '';

        this.variants.forEach(function (val) {

            str += '#EXT-X-MEDIA:NAME="' + val[1] + '"';
            str += os.EOL;
            str += '#EXT-X-STREAM-INF:BANDWIDTH=' + val[2];
            str += os.EOL;
            str += val[0];
            str += EOL;

        });

        return `
    #EXTM3U
#EXT-X-VERSION:3
${str}
    `.trim();
    }
}