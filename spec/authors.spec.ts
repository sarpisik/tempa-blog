import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';

import server from '@server';
import Api from './api';
import AuthorService from '@api/authors/service';
import { IAuthor } from '@api/authors/interface';

describe('Authors Routes', () => {
    let api: Api;
    let db: { release: (arg0: boolean) => void };

    const authorsPath = Api.generatePath('authors');
    const authorIdPath = Api.generateDynamicPath('authors');

    beforeAll((done) => {
        server().then((app) => {
            db = app.locals.db;
            api = new Api(supertest.agent(app));
            done();
        });
    });

    afterAll(() => {
        db.release(true);
    });

    describe(`"GET:${authorsPath}"`, () => {
        const authors: IAuthor[] = [
            {
                id: '12345',
                name: 'Test Author',
                avatar_url: 'test-url',
                description: 'This is a test description.',
                created_at: 'some time zone',
            },
        ];
        it(`should return a JSON object with all the authors and a status code of "${OK}" if the
            request was successful.`, (done) => {
            spyOn(AuthorService.prototype, 'findMany').and.resolveTo(authors);
            api.get(authorsPath).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(authors);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not fetch authors.';
            spyOn(AuthorService.prototype, 'findMany').and.throwError(errMsg);

            api.get(authorsPath).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"POST:${authorsPath}"`, () => {
        const callApi = (reqBody: Record<string, unknown>) => {
            return api.post(authorsPath, reqBody);
        };

        const body = {
            author: {
                name: 'Test Author',
                avatar_url: 'test-url',
                description: 'This is a test description.',
            },
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            const keys = Object.keys(body.author) as Array<
                keyof typeof body['author']
            >;
            spyOn(AuthorService.prototype, 'createOne').and.resolveTo({
                ...body.author,
                id: '12345',
                created_at: 'some time',
            });

            callApi(body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(CREATED);
                keys.forEach((key) => {
                    expect(body.author[key]).toBe(res.body[key]);
                });
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON Record<string, unknown> with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the author param was missing.`, (done) => {
            callApi({}).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not add author.';
            spyOn(AuthorService.prototype, 'createOne').and.throwError(errMsg);

            callApi(body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"PUT:${authorIdPath}"`, () => {
        const callApi = (id: string, reqBody: Record<string, unknown>) => {
            return api.put(authorIdPath.replace(':id', id), reqBody);
        };

        const body: { author: IAuthor } = {
            author: {
                id: '12345',
                name: 'Test Author',
                avatar_url: 'test-url',
                description: 'This is a test description.',
                created_at: 'some time zone',
            },
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(AuthorService.prototype, 'updateOne').and.resolveTo(
                body.author
            );

            callApi(body.author.id, body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(body.author);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the author param was missing.`, (done) => {
            callApi(body.author.id, {}).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const updateErrMsg = 'Could not update author.';
            spyOn(AuthorService.prototype, 'updateOne').and.throwError(
                updateErrMsg
            );

            callApi(body.author.id, body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(updateErrMsg);
                done();
            });
        });
    });

    describe(`"DELETE:${authorIdPath}"`, () => {
        const callApi = (id: string) => {
            return api.delete(authorIdPath.replace(':id', id));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(AuthorService.prototype, 'deleteOne').and.resolveTo();

            callApi('5').end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const deleteErrMsg = 'Could not delete author.';
            spyOn(AuthorService.prototype, 'deleteOne').and.throwError(
                deleteErrMsg
            );

            callApi('1').end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(deleteErrMsg);
                done();
            });
        });
    });
});
