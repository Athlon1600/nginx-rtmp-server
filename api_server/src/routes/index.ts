import {Request, Response, Router} from 'express';
import {HealthCheckService} from "../services/HealthCheckService";
import {authRouter} from "./auth";

const router: Router = Router();

router.get('/favicon.ico', function (req: Request, res: Response) {
    return res.status(204).end();
});


router.get('/', function (req: Request, res: Response) {

    res.json({
        message: 'Hello world from nginx-rtmp-server - API Server',
        docs: "https://github.com/Athlon1600/nginx-rtmp-server"
    });
});

router.use('/auth', authRouter);

router.get('/health', async (req, res) => {

    try {

        await HealthCheckService.checkOrFail();

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
