import {BaseController} from "./BaseController";
import {Request, Response, Router} from "express";
import {OnPublishDonePayload} from "../classes/OnPublishDonePayload";
import {Hooks} from "../hooks";

export class PublishDoneController extends BaseController {

    init(router: Router): void {

        // Will always succeed
        router.post('/on_publish_done', async function (req: Request, res: Response) {

            const payload = req.body as unknown as OnPublishDonePayload;

            console.log('OnPublishDonePayload: ' + JSON.stringify(payload));

            try {
                await Hooks.onPublishDone(payload);
            } catch (ex) {

            }

            res.status(200).send('OK');
        });
    }
}