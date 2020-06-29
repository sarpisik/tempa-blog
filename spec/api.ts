import supertest from 'supertest';

export default class Api {
    constructor(private _agent: supertest.SuperTest<supertest.Test>) {}

    get = (path: string) => this._agent.get(path);

    post = <Body extends Record<string, unknown>>(path: string, body: Body) =>
        this._agent.post(path).type('form').send(body);

    put = <Body extends Record<string, unknown>>(path: string, body: Body) =>
        this._agent.put(path).type('form').send(body);

    delete = (path: string) => this._agent.delete(path);
}
