import {BaseController} from "./BaseController";
import {Request, Response, Router} from "express";
import {OnPublishDonePayload} from "../classes/OnPublishDonePayload";
import {Hooks} from "../hooks";
import {Logger} from "../classes/Logger";
import {Database} from "../Database";

export class PublishDoneController extends BaseController {

    init(router: Router): void {

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
    }
}