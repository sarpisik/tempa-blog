/* eslint-disable @typescript-eslint/ban-ts-comment */

class BaseRequestHandler {
    private _prefixUrl: string;

    constructor(protected _url: string, protected _options: RequestInit) {
        this._prefixUrl =
            (process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : '') + '/api';
    }

    private _generateUrl() {
        return this._prefixUrl + this._url;
    }

    protected _send() {
        return fetch(this._generateUrl(), this._options);
    }
}

class RequestJsonHandler extends BaseRequestHandler {
    constructor(
        url: string,
        options: ConstructorParameters<typeof BaseRequestHandler>[1] = {}
    ) {
        options.headers = options?.headers || {};
        // @ts-ignore
        options.headers['Accept'] = 'application/json';
        // @ts-ignore
        options.headers['Content-Type'] = 'application/json';

        super(url, options);
    }

    private _parseJson<R extends globalThis.Response>(res: R) {
        return res.json();
    }

    sendJson<R>() {
        return super._send().then<R | { error: string }>(this._parseJson);
    }
}

type RequestPostOptions = Omit<RequestInit, 'body'> & {
    body?: Record<string, unknown> | string;
};

export class PostRequest extends RequestJsonHandler {
    constructor(url: string, options: RequestPostOptions = {}) {
        options.method = 'post';
        options.body = JSON.stringify(options.body);
        // @ts-ignore
        super(url, options);
    }
}

export class GetRequest extends RequestJsonHandler {
    constructor(
        url: string,
        options: ConstructorParameters<typeof RequestJsonHandler>[1] = {}
    ) {
        options.method = 'get';
        super(url, options);
    }
}