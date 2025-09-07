import {Screenshot} from "./Screenshot";
import {Util} from "../Util";
import {Logger} from "./Logger";

const path = require('path');
const fs = require('fs');

export class ScreenshotWorker {

    // TOO cpu intensive!
    public static EVERY_MS = 8 * 1000;

    protected inputUrl: string;
    protected outPath: string;

    protected interval: NodeJS.Timeout;

    constructor(inputUrl: string, outPath: string) {
        this.inputUrl = inputUrl;
        this.outPath = outPath;
    }

    public start() {

        const outPathAbs = path.resolve(this.outPath);

        Logger.debug(`Grabbing screenshots from: ${this.inputUrl} to ${outPathAbs}`);

        this.interval = setInterval(async () => {

            // has to exist and be writable
            try {
                fs.mkdirSync(Util.storagePath('screens'));
            } catch (ex) {
                // do nothing
            }

            try {
                await Screenshot.capture(this.inputUrl, outPathAbs);
            } catch (ex) {
                Logger.error('Screenshot Worker error: ' + ex);
            }

        }, ScreenshotWorker.EVERY_MS);
    }

    public stop() {
        clearInterval(this.interval);
    }
}