import {Database} from "../Database";
import {OnPublishDonePayload, OnPublishPayload} from "../types/rtmp";

export class StreamService {

    static async startStreamFromStreamKeyOrFail(streamKey: string, onPublishPayload: OnPublishPayload): Promise<void> {

        const channel = await Database.getInstance().findChannelByStreamKey(streamKey);

        if (!channel) {
            throw new Error(`No such channel with such stream key: ${streamKey} was found`);
        }

        const str = JSON.stringify(onPublishPayload);

        await Database.getInstance().createNewStream(channel.id, onPublishPayload.addr, str);

        // we are live, although there will be delay
        await Database.getInstance().updateLiveStatusForChannel(channel.id, true);
    }

    static async endStreamByStreamKey(streamKey: string, onPublishDonePayload: OnPublishDonePayload): Promise<void> {

        const channel = await Database.getInstance().findChannelByStreamKey(streamKey);

        if (channel) {
            await Database.getInstance().endStream(channel.id, onPublishDonePayload.bytes_in);
            await Database.getInstance().updateLiveStatusForChannel(channel.id, false);
        }
    }
}
