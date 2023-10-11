import {Request, Response, Router} from "express";
import {OnPublishPayload} from "../classes/OnPublishPayload";
import {Logger} from "../classes/Logger";
import {Hooks} from "../hooks";
import {StreamInfo} from "../classes/StreamInfo";
import {Util} from "../Util";
import {Database} from "../Database";

const router: Router = Router();

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

        } else {
            return res.status(409).send('Another stream in progress');
        }

    } catch (ex) {
        Logger.error(ex);
    }

    res.status(400).send('Unauthorized');
});

export default router;