import {BaseController} from "./BaseController";
import {Request, Response, Router} from "express";
import {Database} from "../Database";

export class IndexController extends BaseController {

    init(router: Router): void {

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

        })
    }
}