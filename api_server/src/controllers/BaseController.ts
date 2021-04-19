import {Router} from "express";

export abstract class BaseController {
    abstract init(router: Router): void;
}