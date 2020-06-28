import { Router } from 'express';

export type RouterType = typeof Router;

export default class Controller {
    router: Router;

    constructor(router: RouterType, public path: string) {
        this.router = router();
    }
}
