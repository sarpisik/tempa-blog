import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';

import server from '@server';
import Api from './api';
import CommentService from '@api/comments/service';
import { IComment } from '@api/comments/interface';

describe('Comments Routes', () => {
    let api: Api;
    let db: { release: (arg0: boolean) => void };

    const commentsPath = Api.generatePath('comments');
    const commentIdPath = Api.generateDynamicPath('comments');

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

    describe(`"GET:${commentsPath}"`, () => {
        const comments: IComment[] = [
            {
                id: '12345',
                user_id: 'userid',
                blog_id: 'blogid',
                content: 'comment',
                created_at: 'some time zone',
            },
        ];
        it(`should return a JSON object with all the comments and a status code of "${OK}" if the
            request was successful.`, (done) => {
            spyOn(CommentService.prototype, 'findMany').and.resolveTo(comments);

            api.get(commentsPath).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(comments);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not fetch comments.';
            spyOn(CommentService.prototype, 'findMany').and.throwError(errMsg);

            api.get(commentsPath).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"POST:${commentsPath}"`, () => {
        const callApi = (reqBody: Record<string, unknown>) => {
            return api.post(commentsPath, reqBody);
        };

        const body = {
            comment: {
                user_id: 'Test Comment',
                blog_id: 'test@example.com',
                content: 'comment',
            },
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            const keys = Object.keys(body.comment) as Array<
                keyof typeof body['comment']
            >;
            spyOn(CommentService.prototype, 'createOne').and.resolveTo({
                ...body.comment,
                id: '12345',
                created_at: 'some time',
            });

            callApi(body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(CREATED);
                keys.forEach((key) => {
                    expect(body.comment[key]).toBe(res.body[key]);
                });
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON Record<string, unknown> with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the comment param was missing.`, (done) => {
            callApi({}).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not add comment.';
            spyOn(CommentService.prototype, 'createOne').and.throwError(errMsg);

            callApi(body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"PUT:${commentIdPath}"`, () => {
        const callApi = (id: string, reqBody: Record<string, unknown>) => {
            return api.put(commentIdPath.replace(':id', id), reqBody);
        };

        const body: { comment: IComment } = {
            comment: {
                id: '12345',
                user_id: 'userid',
                blog_id: 'blogid',
                content: 'comment',
                created_at: 'some time zone',
            },
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(CommentService.prototype, 'updateOne').and.resolveTo(
                body.comment
            );

            callApi(body.comment.id, body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(body.comment);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the comment param was missing.`, (done) => {
            callApi(body.comment.id, {}).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const updateErrMsg = 'Could not update comment.';
            spyOn(CommentService.prototype, 'updateOne').and.throwError(
                updateErrMsg
            );

            callApi(body.comment.id, body).end((err, res) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(updateErrMsg);
                done();
            });
        });
    });

    describe(`"DELETE:${commentIdPath}"`, () => {
        const callApi = (id: string) => {
            return api.delete(commentIdPath.replace(':id', id));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(CommentService.prototype, 'deleteOne').and.resolveTo();

            callApi('5').end((err, res) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const deleteErrMsg = 'Could not delete comment.';
            spyOn(CommentService.prototype, 'deleteOne').and.throwError(
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
