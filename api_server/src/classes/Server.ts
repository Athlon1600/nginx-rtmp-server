import {Application, Router} from "express";
import {BaseController} from "../controllers/BaseController";
import {Logger} from "./Logger";

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

        app.use(express.static('public', {
            etag: false
        }));

        this.app = app;
    }

    public registerController(controller: BaseController) {
        controller.init(this.router);
    }

    public start(port: any) {

        this.app.use(this.router);

        this.app.listen(port, function () {
            Logger.log(`Running on http://localhost:${port}`);
        });
    }
}