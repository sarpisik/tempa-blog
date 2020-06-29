import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response } from 'supertest';

import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';

import server from '@server';
import { pool } from '@db/database';
import AuthorService from '@api/authors/service';
import { IAuthor } from '@api/authors/interface';
import Api from './api';

describe('Authors Routes', () => {
    const authorsPath = '/api/authors';
    const addAuthorsPath = `${authorsPath}`;
    const updateAuthorPath = `${authorsPath}/:id`;
    const deleteAuthorPath = `${authorsPath}/:id`;

    let api: Api;

    beforeAll((done) => {
        pool.query('DROP TABLE IF EXISTS authors CASCADE')
            // .then(() => pool.end())
            .then(() => server())
            .then((app) => {
                api = new Api(supertest.agent(app));
                done();
            });
    });
    afterAll((done) => {
        pool.query('DROP TABLE IF EXISTS authors CASCADE').then(done);
    });

    describe(`"GET:${authorsPath}"`, () => {
        // const authors: IAuthor[] = [
        //     {
        //         id: '12345',
        //         name: 'Test Author',
        //         avatar_url: 'test-url',
        //         description: 'This is a test description.',
        //         created_at: 'some time zone',
        //     },
        // ];
        it(`should return a JSON object with all the authors and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // spyOn(AuthorService.prototype, 'findMany').and.resolveTo(authors);
            api.get(authorsPath).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                // expect(res.body).toEqual(authors);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not fetch authors.';
            spyOn(AuthorService.prototype, 'findMany').and.throwError(errMsg);

            api.get(authorsPath).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"POST:${addAuthorsPath}"`, () => {
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
            api.post(addAuthorsPath, body).end((err: Error, res: Response) => {
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
            api.post(addAuthorsPath, {}).end((err: Error, res: Response) => {
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

            api.post(addAuthorsPath, body).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"PUT:${updateAuthorPath}"`, () => {
        let author: IAuthor;
        const updatePath = (id = author.id) =>
            updateAuthorPath.replace(':id', id);
        const body = {
            author: {
                name: 'Test2 Author',
                avatar_url: 'test2-url',
                description: 'This is another test description.',
            },
        };
        beforeAll((done) => {
            api.post(addAuthorsPath, {
                author: {
                    name: 'Test Author',
                    avatar_url: 'test-url',
                    description: 'This is a test description.',
                },
            }).end((err: Error, res: Response) => {
                pErr(err);
                author = res.body;
                done();
            });
        });

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            api.put(updatePath(), body).end((err: Error, res: Response) => {
                const { name, avatar_url, description } = res.body;
                pErr(err);
                expect(res.status).toBe(OK);
                expect({ name, avatar_url, description }).toEqual(body.author);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the author param was missing.`, (done) => {
            api.put(updatePath(), {}).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const badId = '1234';
            const updateErrMsg = `invalid input syntax for type uuid: "${badId}"`;

            api.put(updatePath(badId), body).end(
                (err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                }
            );
        });
    });

    describe(`"DELETE:${deleteAuthorPath}"`, () => {
        let author: IAuthor;
        const deletePath = (id = author.id) =>
            deleteAuthorPath.replace(':id', id);
        beforeAll((done) => {
            api.post(addAuthorsPath, {
                author: {
                    name: 'Test Author',
                    avatar_url: 'test-url',
                    description: 'This is a test description.',
                },
            }).end((err: Error, res: Response) => {
                pErr(err);
                author = res.body;
                done();
            });
        });

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            api.delete(deletePath()).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const badId = '1234';
            const deleteErrMsg = `invalid input syntax for type uuid: "${badId}"`;
            api.delete(deletePath(badId)).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(deleteErrMsg);
                done();
            });
        });
    });
});
