import {Application, Router, Request, Response} from "express";
import {Logger} from "./Logger";
import {routes} from "../routes";

const express = require("express");

export class Server {

    protected app: Application;
    protected router: Router;

    constructor() {

        let app = express();
        this.router = Router();

        app.set('etag', false);
        app.disable('x-powered-by');

        app.use(express.urlencoded({
            extended: true
        }));

        app.use(express.json());

        app.use(express.static('public', {
            etag: false
        }));

        this.app = app;
    }

    public start(port: any) {

        this.app.use(this.router);
        this.app.use("/", routes);

        this.app.use((req: Request, res: Response, next) => {

            const path = req.path;

            res.status(404).json({
                error: `${path} not found`
            });
        });

        // must be registered AFTER all routes
        this.app.use((error: Error, req: Request, res: Response, next: any) => {

            res.status(500).json({
                error: error.message ?? error,
                // stack: error.stack ?? null
            });
        });

        this.app.listen(port, function () {
            Logger.log(`Running on http://localhost:${port}`);
        });
    }
}