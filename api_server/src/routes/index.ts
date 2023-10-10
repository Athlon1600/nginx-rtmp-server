import {Request, Response, Router} from 'express';
import publishDone from "./publish-done";
import publish from "./publish";
import {Database} from "../Database";

const router: Router = Router();

router.use('/', publish);
router.use('/', publishDone);

router.get('/favicon.ico', function (req: Request, res: Response) {
    return res.status(204).end();
});

router.get('/', function (req: Request, res: Response) {

    res.json({
        message: 'Hello world from nginx-rtmp-server - API Server'
    });
});

router.get('/health', async (req, res) => {

    try {

        await Database.getInstance().ping();

        res.json({
            status: 'OK'
        });

    } catch (e) {

        res.json({
            error: e
        });
    }

});

export const routes = router;
