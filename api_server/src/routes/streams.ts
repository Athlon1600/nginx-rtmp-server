import {Request, Response, Router} from "express";
import {OnPublishPayload} from "../classes/OnPublishPayload";
import {StreamService} from "../services/StreamService";
import {OnPublishDonePayload} from "../classes/OnPublishDonePayload";

const router = Router();

router.get('/streams', (req: Request, res: Response) => {

    return res.json({
        live: []
    })
});

// new stream has begun!
router.post('/streams', (req: Request, res: Response) => {

    const payload: OnPublishPayload = req.body;

    if (payload.name) {

        StreamService.startStreamFromStreamKeyOrFail(payload.name, payload).then(() => {
            res.status(201);
        }).catch(() => {

            // res.status(409).send('Another stream in progress');
            // res.status(503).send("no encoding capacity available");

            res.status(401);
        });

    } else {
        res.status(400);
    }

});

router.post('/streams/end', (req: Request, res: Response) => {

    const payload: OnPublishDonePayload = req.body;

    if (payload.name) {

        setTimeout(() => {
            StreamService.endStreamByStreamKey(payload.name, payload);
        }, 1);
    }

    res.status(200).end();

});

export const streamsRouter: Router = router;