import { Request, Response, NextFunction } from 'express';
import {
    RequestHandler,
    Params,
    ParamsDictionary,
} from 'express-serve-static-core';

interface ParsedQs {
    [key: string]: string | string[];
}

export function withCatch<
    P extends Params = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs
>(wrappedController: RequestHandler<P, ResBody, ReqBody, ReqQuery>) {
    return function wrapperController(
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction
    ) {
        return wrappedController(req, res, next).catch(next);
    };
}
