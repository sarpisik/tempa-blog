import { NextFunction, Request, Response } from 'express';
import { environment } from '@shared/constants';
import { withCatch } from '@shared/hofs';
import Controller from './controller';

export interface Locals {
    path: string;
    title: string;
    stylesheets: string[];
    scripts: string[];
}
export type Router = ConstructorParameters<typeof Controller>[0];
export type RenderPage = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>;

export default class PageController extends Controller {
    protected _title: string;
    protected _stylesheets: string[];
    protected _scripts: string[];
    private _renderPage: RenderPage;

    constructor(
        router: Router,
        { path, scripts, stylesheets, title }: Locals,
        renderPage: RenderPage
    ) {
        super(router, path);

        if (environment === 'production') {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { manifestParser } = require('./assets_loader');
            const manifest = manifestParser();
            this._stylesheets = stylesheets.map(
                (stylesheet) => manifest[stylesheet]
            );
            this._scripts = scripts.map((script) => manifest[script]);
        } else {
            this._stylesheets = stylesheets;
            this._scripts = scripts;
        }
        this._title = title;
        this._renderPage = renderPage.bind(this);
        this._initializeRoutes();
    }

    protected _generateLocals = () => {
        const stylesheets = this._stylesheets;
        const scripts = this._scripts;
        const title = this._title;

        return { stylesheets, scripts, title };
    };

    private _initializeRoutes = () => {
        this.router.get(this.path, withCatch(this._renderPage));
    };
}
