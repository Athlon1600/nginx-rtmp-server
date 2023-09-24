import {BaseController} from "./BaseController";
import {Request, Response, Router} from "express";
import {OnPublishPayload} from "../classes/OnPublishPayload";
import {Hooks} from "../hooks";
import {Logger} from "../classes/Logger";
import {Util} from "../Util";
import {StreamInfo} from "../classes/StreamInfo";
import {Database} from "../Database";

export class PublishController extends BaseController {

    init(router: Router): void {

        /**
         // TODO: this will create two identical playlists: /{streamKey} and /{master}
         return res.redirect(302, 'rtmp://127.0.0.1/hls/' + status.new_name);
         */
        router.post('/on_publish', async function (req: Request, res: Response) {

            const params = req.body as unknown as OnPublishPayload;

            Logger.log('OnPublishPayload: ' + JSON.stringify(params));

            try {
                let result = await Hooks.onPublish(params);

                if (result) {
                    res.status(201).send('OK');

                    res.on('finish', () => {

                        StreamInfo.probeAsync(Util.rtmpStreamUrl(params.name))
                            .then((streamInfo) => {

                                Database.getInstance().createNewStream(params.name, params.addr, JSON.stringify(streamInfo));

                            });

                    });

                    return;
                }

            } catch (ex) {
                console.error(ex);
                // report!
            }

            res.status(400).send('Unauthorized');
        });
    }
}