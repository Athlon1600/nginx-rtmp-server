import {OnPublishDonePayload} from "../classes/OnPublishDonePayload";
import {Request, Response, Router} from "express";
import {Logger} from "../classes/Logger";
import {Hooks} from "../hooks";
import {Database} from "../Database";

const router: Router = Router();

// Will always succeed
router.post('/on_publish_done', async function (req: Request, res: Response) {

    const payload = req.body as unknown as OnPublishDonePayload;

    Logger.log('OnPublishDonePayload: ' + JSON.stringify(payload));

    try {
        await Hooks.onPublishDone(payload);
    } catch (ex) {

    }

    res.on('finish', () => {
        Database.getInstance().updateStreamInfo(payload.name, payload.bytes_in);
    })

    res.status(200).send('OK');
});

export default router;
