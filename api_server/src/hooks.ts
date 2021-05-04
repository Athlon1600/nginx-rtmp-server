import {OnPublishPayload} from "./classes/OnPublishPayload";
import {OnPublishDonePayload} from "./classes/OnPublishDonePayload";
import {ScreenshotWorker} from "./classes/ScreenshotWorker";
import {Transcoder} from "./classes/Transcoder";
import {Logger} from "./classes/Logger";

// Keep a list of "open" streams
const map = new Map<string, any>();
const screenWorkers = new Map<string, ScreenshotWorker>();

export class Hooks {

    static async onPublish(payload: OnPublishPayload): Promise<boolean> {

        // rtmp://server/live/{NAME}
        const name = payload.name;

        if (!map.has(name)) {
            map.set(name, 1);

            const transcoder = new Transcoder(name);

            transcoder.start()
                .then(function () {
                    Logger.log('Transcoder finished. Exited gracefully.')
                })
                .catch(function (err) {
                    Logger.error('Transcoder stopped with error: ' + err);
                });

            let worker = new ScreenshotWorker(name);
            worker.start();

            screenWorkers.set(name, worker);

            return true;
        }

        Logger.log('Active stream already in process under this handle: ' + name);

        return false;
    }

    static async onPublishDone(payload: OnPublishDonePayload): Promise<void> {
        const name = payload.name;
        map.delete(name);

        if (screenWorkers.has(name)) {
            screenWorkers.get(name).stop();
        }
    }
}