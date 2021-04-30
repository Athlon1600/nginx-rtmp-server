import {Screenshot} from "./Screenshot";
import {Util} from "../Util";

const fs = require('fs');

export class ScreenshotWorker {

    // TOO cpu intensive!
    public static EVERY_MS = 8 * 1000;

    protected name: string;
    protected interval: NodeJS.Timer;

    constructor(name: string) {
        this.name = name;
    }

    public start() {

        const name = this.name;

        this.interval = setInterval(async function () {

            // has to exist and be writable
            try {
                fs.mkdirSync(Util.storagePath('screens'));
            } catch (ex) {
                console.log('screens directory already exists!');
            }

            let dest = Util.storagePath('screens/' + name + '.png');

            try {
                await Screenshot.capture(Util.rtmpStreamUrl(name), dest);
            } catch (ex) {
                console.log(ex);
            }

        }, ScreenshotWorker.EVERY_MS);
    }

    public stop() {
        clearInterval(this.interval);
    }
}