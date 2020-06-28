import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';

import server from '@server';
import BlogsService from '@api/blogs/service';
import { IBlog } from '@api/blogs/interface';

describe('Blogss Routes', () => {
    const blogsPath = '/api/blogs';
    const addBlogssPath = `${blogsPath}`;
    const updateBlogsPath = `${blogsPath}/:id`;
    const deleteBlogsPath = `${blogsPath}/:id`;

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        server().then((app) => {
            agent = supertest.agent(app);

            done();
        });
    });

    describe(`"GET:${blogsPath}"`, () => {
        const blogs: IBlog[] = [
            {
                id: '12345',
                author_id: '54321',
                created_at: '01.01.2222',
                content: 'Demo blog content.',
                status: 'draft',
            },
        ];
        it(`should return a JSON object with all the blogs and a status code of "${OK}" if the
            request was successful.`, (done) => {
            spyOn(BlogsService.prototype, 'findMany').and.resolveTo(blogs);
            agent.get(blogsPath).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(blogs);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not fetch blogs.';
            spyOn(BlogsService.prototype, 'findMany').and.throwError(errMsg);

            agent.get(blogsPath).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"POST:${addBlogssPath}"`, () => {
        const callApi = (reqBody: Record<string, unknown>) => {
            return agent.post(addBlogssPath).type('form').send(reqBody);
        };

        const body = {
            blog: {
                author_id: '54321',
                content: 'Demo blog content.',
                status: 'draft',
            },
        } as const;

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            const keys = Object.keys(body.blog) as Array<
                keyof typeof body['blog']
            >;
            spyOn(BlogsService.prototype, 'createOne').and.resolveTo({
                ...body.blog,
                id: '12345',
                created_at: 'some time',
            });

            agent
                .post(addBlogssPath)
                .type('form')
                .send(body) // pick up here
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    keys.forEach((key) => {
                        expect(body.blog[key]).toBe(res.body[key]);
                    });
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON Record<string, unknown> with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the blog param was missing.`, (done) => {
            callApi({}).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not add blog.';
            spyOn(BlogsService.prototype, 'createOne').and.throwError(errMsg);

            callApi(body).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"PUT:${updateBlogsPath}"`, () => {
        const callApi = (id: string, reqBody: Record<string, unknown>) => {
            return agent
                .put(updateBlogsPath.replace(':id', id))
                .type('form')
                .send(reqBody);
        };

        const body: { blog: IBlog } = {
            blog: {
                id: '12345',
                author_id: '54321',
                created_at: '01.01.2222',
                content: 'Demo blog content.',
                status: 'published',
            },
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(BlogsService.prototype, 'updateOne').and.resolveTo(body.blog);

            callApi(body.blog.id, body).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(body.blog);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the blog param was missing.`, (done) => {
            callApi(body.blog.id, {}).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const updateErrMsg = 'Could not update blog.';
            spyOn(BlogsService.prototype, 'updateOne').and.throwError(
                updateErrMsg
            );

            callApi(body.blog.id, body).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(updateErrMsg);
                done();
            });
        });
    });

    describe(`"DELETE:${deleteBlogsPath}"`, () => {
        const callApi = (id: string) => {
            return agent.delete(deleteBlogsPath.replace(':id', id));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(BlogsService.prototype, 'deleteOne').and.resolveTo();

            callApi('5').end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const deleteErrMsg = 'Could not delete blog.';
            spyOn(BlogsService.prototype, 'deleteOne').and.throwError(
                deleteErrMsg
            );

            callApi('1').end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(deleteErrMsg);
                done();
            });
        });
    });
});
