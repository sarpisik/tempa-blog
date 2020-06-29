import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';

import server from '@server';
import Api from './api';
import UserService from '@api/users/service';
import { IUser } from '@api/users/interface';

describe('Users Routes', () => {
    let api: Api;
    let db: { release: (arg0: boolean) => void };

    const usersPath = Api.generatePath('users');
    const userIdPath = Api.generateDynamicPath('users');

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

    describe(`"GET:${usersPath}"`, () => {
        const users: IUser[] = [
            {
                id: '12345',
                name: 'Test User',
                email: 'test@example.com',
                created_at: 'some time zone',
            },
        ];
        it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {
            spyOn(UserService.prototype, 'findMany').and.resolveTo(users);
            api.get(usersPath).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(users);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not fetch users.';
            spyOn(UserService.prototype, 'findMany').and.throwError(errMsg);

            api.get(usersPath).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"POST:${usersPath}"`, () => {
        const callApi = (reqBody: Record<string, unknown>) => {
            return api.post(usersPath, reqBody);
        };

        const body = {
            user: { name: 'Test User', email: 'test@example.com' },
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            const keys = Object.keys(body.user) as Array<
                keyof typeof body['user']
            >;
            spyOn(UserService.prototype, 'createOne').and.resolveTo({
                ...body.user,
                id: '12345',
                created_at: 'some time',
            });

            callApi(body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(CREATED);
                keys.forEach((key) => {
                    expect(body.user[key]).toBe(res.body[key]);
                });
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON Record<string, unknown> with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            callApi({}).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not add user.';
            spyOn(UserService.prototype, 'createOne').and.throwError(errMsg);

            callApi(body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"PUT:${userIdPath}"`, () => {
        const callApi = (id: string, reqBody: Record<string, unknown>) => {
            return api.put(userIdPath.replace(':id', id), reqBody);
        };

        const body: { user: IUser } = {
            user: {
                id: '12345',
                name: 'Test User',
                email: 'test@example.com',
                created_at: 'some time zone',
            },
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(UserService.prototype, 'updateOne').and.resolveTo(body.user);

            callApi(body.user.id, body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(body.user);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            callApi(body.user.id, {}).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const updateErrMsg = 'Could not update user.';
            spyOn(UserService.prototype, 'updateOne').and.throwError(
                updateErrMsg
            );

            callApi(body.user.id, body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(updateErrMsg);
                done();
            });
        });
    });

    describe(`"DELETE:${userIdPath}"`, () => {
        const callApi = (id: string) => {
            return api.delete(userIdPath.replace(':id', id));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(UserService.prototype, 'deleteOne').and.resolveTo();

            callApi('5').end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const deleteErrMsg = 'Could not delete user.';
            spyOn(UserService.prototype, 'deleteOne').and.throwError(
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
