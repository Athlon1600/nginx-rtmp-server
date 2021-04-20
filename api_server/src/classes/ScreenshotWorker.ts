import {Screenshot} from "./Screenshot";
import {Filesystem} from "./Filesystem";

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

            let dest = Filesystem.publicPath('screens/' + name + '.png');

            try {
                await Screenshot.run('rtmp://rtmp/live/' + name, dest);
            } catch (ex) {
                console.log(ex);
            }

        }, ScreenshotWorker.EVERY_MS);
    }

    public stop() {
        clearInterval(this.interval);
    }
}