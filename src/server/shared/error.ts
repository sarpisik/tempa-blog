import { paramMissingError } from './constants';
import { BAD_REQUEST } from 'http-status-codes';

export class CustomError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }
}

export class BadRequestError extends CustomError {
    constructor(message = paramMissingError) {
        super(BAD_REQUEST, message);
    }
}
