/* eslint-disable @typescript-eslint/no-var-requires */
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { Request, Response, NextFunction } from 'express';
import expressStaticGzip from 'express-static-gzip';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import controllers from './controllers';
import logger from '@shared/Logger';
import { CustomError } from '@shared/error';
import database from './db/database';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default async function server() {
    // Connect database if we are not testing.
    const db = await database();

    // Init express
    const app = express();

    // Keep db connection to release when testing files.
    app.locals.db = db;

    /************************************************************************************
     *                              Set development settings
     ***********************************************************************************/

    if (isDev) {
        // hot module reload
        const cors = require('cors');
        const webpack = require('webpack');
        const webpackHotMiddleware = require('webpack-hot-middleware');
        const webpackDevMiddleware = require('webpack-dev-middleware');
        const config = require('../client/webpack.config');
        const compiler = webpack(config);

        app.use(cors());

        app.use(
            webpackDevMiddleware(compiler, {
                noInfo: true,
                publicPath: config.output.publicPath,
                stats: false,
            })
        );
        app.use(webpackHotMiddleware(compiler));

        // Show routes called in console
        app.use(morgan('dev'));

        // Serve multer uploads
        app.use(
            '/uploads',
            express.static(path.resolve(__dirname, '../../uploads'))
        );
    }

    /************************************************************************************
     *                              Set basic express settings
     ***********************************************************************************/

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Pass environment state to handlers
    app.locals.production = isProd;

    /************************************************************************************
     *                              Set production settings
     ***********************************************************************************/

    if (isProd) {
        // Security
        app.use(helmet());

        // Serve zipped static files
        app.use(
            '/',
            expressStaticGzip(path.join(__dirname, 'public'), { index: false })
        );
    }

    /************************************************************************************
     *                              Serve front-end content
     ***********************************************************************************/

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, 'public')));

    /************************************************************************************
     *                              Serve panel content
     ***********************************************************************************/

    app.get('/panel', (_req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'panel'));
    });

    /************************************************************************************
     *                              Serve controllers
     ***********************************************************************************/

    controllers(db).forEach((controller) => {
        app.use('/', controller.router);
    });

    // Print API errors
    app.use(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (
            err: CustomError,
            req: Request,
            res: Response,
            _next: NextFunction
        ) => {
            logger.error(err.message, err);
            return res.status(err.statusCode || BAD_REQUEST).json({
                error: err.message,
            });
        }
    );

    return app;
}
