import {OnPublishPayload} from "./classes/OnPublishPayload";
import {OnPublishDonePayload} from "./classes/OnPublishDonePayload";

// Keep a list of "open" streams
const map = new Map<string, any>();

export class Hooks {

    static async onPublish(payload: OnPublishPayload): Promise<boolean> {

        // rtmp://server/live/{NAME}
        const name = payload.name;

        if (!map.has(name)) {
            map.set(name, 1);

            return true;
        }

        return false;
    }

    static async onPublishDone(payload: OnPublishDonePayload): Promise<void> {
        const name = payload.name;
        map.delete(name);
    }
}