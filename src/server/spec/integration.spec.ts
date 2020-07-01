// Integration test of whole application
import supertest from 'supertest';
import { CREATED, OK } from 'http-status-codes';

import { pErr } from '@shared/functions';

import server from '@server';
import Api from './api';

import { IBlog } from '@api/blogs/interface';

describe('Application', () => {
    let api: Api;
    let db: {
        release: (arg0: boolean) => void;
        query: (arg0: string) => Promise<unknown>;
    };

    const authorsPath = Api.generatePath('authors');
    const authorIdPath = Api.generateDynamicPath('authors');

    const blogsPath = Api.generatePath('blogs');
    const blogIdPath = Api.generateDynamicPath('blogs');

    const usersPath = Api.generatePath('users');
    const userIdPath = Api.generateDynamicPath('users');

    const commentsPath = Api.generatePath('comments');
    const commentIdPath = Api.generateDynamicPath('comments');

    const dynamicPath = (path: string, id: string) => path.replace(':id', id);
    const generateAuthorBody = (
        author = {
            email: 'test@example.com',
            name: 'John DOE',
            avatar_url: 'http://avatrs.com/john-doe',
            bio: 'Awsome blogger.',
        }
    ) => ({ author });
    const generateBlogBody = (author_id: string, status: IBlog['status']) => ({
        blog: {
            author_id,
            status,
            content: 'Awsome blog post.',
        },
    });
    const generateUserBody = (
        user = {
            name: 'Jack BLACK',
            email: 'jackblack@example.com',
        }
    ) => ({ user });
    const generateCommentBody = (user_id: string, blog_id: string) => ({
        comment: {
            user_id,
            blog_id,
            content: 'Awsome blog post.',
        },
    });

    beforeAll((done) => {
        server().then((app) => {
            db = app.locals.db;
            api = new Api(supertest.agent(app));
            done();
        });
    });

    afterAll((done) => {
        Promise.all([
            db.query('DROP TABLE IF EXISTS authors CASCADE'),
            db.query('DROP TABLE IF EXISTS users CASCADE'),
        ]).then(() => {
            db.query('DROP TABLE IF EXISTS blogs CASCADE').then(() => {
                db.query('DROP TABLE IF EXISTS comments CASCADE').then(() => {
                    db.release(true);
                    done();
                });
            });
        });
    });

    describe('CRUD operations of', () => {
        it('authors api should succeed.', (done) => {
            api.post(authorsPath, generateAuthorBody()).then((res) => {
                const updateBody = generateAuthorBody({
                    email: 'test@example.com',
                    name: 'Jane WRITER',
                    avatar_url: 'http://avatrs.com/jane-writer',
                    bio: 'Awsome blogger.',
                });
                api.put(
                    dynamicPath(authorIdPath, res.body.id),
                    updateBody
                ).then((res) => {
                    const { id, name, avatar_url, bio } = res.body;
                    expect(res.status).toBe(OK);
                    expect({ name, avatar_url, bio }).toEqual(
                        updateBody.author
                    );
                    expect(res.body.error).toBeUndefined();

                    api.delete(dynamicPath(authorIdPath, id)).end(
                        (err, res) => {
                            pErr(err);
                            expect(res.status).toBe(OK);
                            expect(res.body.error).toBeUndefined();
                            done();
                        }
                    );
                });
            });
        });

        it('blogs api should succeed when author deleted', (done) => {
            api.post(authorsPath, generateAuthorBody()).then((res) => {
                // Create blog
                const authorId = res.body.id;
                const blogBody = generateBlogBody(authorId, 'draft');
                api.post(blogsPath, blogBody).then((res) => {
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();

                    // Update blog
                    const blog = res.body;
                    blog.status = 'published';
                    api.put(dynamicPath(blogIdPath, blog.id), {
                        blog,
                    }).then((res) => {
                        expect(res.status).toBe(OK);
                        expect(res.body.status).toBe(blog.status);
                        expect(res.body.error).toBeUndefined();

                        // Delete author
                        api.delete(dynamicPath(authorIdPath, authorId)).then(
                            (res) => {
                                expect(res.status).toBe(OK);
                                expect(res.body.error).toBeUndefined();

                                // Confirm blog deleted
                                api.get(dynamicPath(blogIdPath, blog.id)).end(
                                    (err, res) => {
                                        pErr(err);
                                        expect(res.status).toBe(OK);
                                        expect(res.body.error).toBeUndefined();
                                        done();
                                    }
                                );
                            }
                        );
                    });
                });
            });
        });

        it('blogs api should succeed when blog deleted', (done) => {
            api.post(authorsPath, generateAuthorBody()).then((res) => {
                // Create blog
                const authorId = res.body.id;
                const blogBody = generateBlogBody(authorId, 'draft');
                api.post(blogsPath, blogBody).then((res) => {
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();

                    // Update blog
                    const blog = res.body;
                    blog.status = 'published';
                    api.put(dynamicPath(blogIdPath, blog.id), {
                        blog,
                    }).then((res) => {
                        const { id, status } = res.body;
                        expect(res.status).toBe(OK);
                        expect(status).toBe(blog.status);
                        expect(res.body.error).toBeUndefined();

                        // Delete blog
                        api.delete(dynamicPath(blogIdPath, id)).end(
                            (err, res) => {
                                pErr(err);
                                expect(res.status).toBe(OK);
                                expect(res.body.error).toBeUndefined();
                                done();
                            }
                        );
                    });
                });
            });
        });

        it('users api should succeed.', (done) => {
            // Create user
            api.post(usersPath, generateUserBody()).then((res) => {
                // Update user
                const updateBody = generateUserBody({
                    name: 'Black JACK',
                    email: 'blackjack@example.com',
                });
                api.put(dynamicPath(userIdPath, res.body.id), updateBody).then(
                    (res) => {
                        const { id, name, email } = res.body;
                        expect(res.status).toBe(OK);
                        expect({ name, email }).toEqual(updateBody.user);
                        expect(res.body.error).toBeUndefined();

                        // Delete user
                        api.delete(dynamicPath(userIdPath, id)).end(
                            (err, res) => {
                                pErr(err);
                                expect(res.status).toBe(OK);
                                expect(res.body.error).toBeUndefined();
                                done();
                            }
                        );
                    }
                );
            });
        });
    });

    it('comments api should succeed.', (done) => {
        // Create author
        api.post(authorsPath, generateAuthorBody()).then((res) => {
            const authorId = res.body.id;

            // Create blog
            const blogBody = generateBlogBody(authorId, 'published');
            api.post(blogsPath, blogBody).then((res) => {
                expect(res.status).toBe(CREATED);
                expect(res.body.error).toBeUndefined();
                const blogId = res.body.id;

                // Create user
                api.post(usersPath, generateUserBody()).then((res) => {
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();

                    // Create comments
                    const userId = res.body.id;
                    const commentBodies = [
                        generateCommentBody(userId, blogId),
                        generateCommentBody(userId, blogId),
                    ];
                    Promise.all(
                        commentBodies.map((commentBody) =>
                            api.post(commentsPath, commentBody)
                        )
                    ).then((responses) => {
                        responses.forEach((res) => {
                            expect(res.status).toBe(CREATED);
                            expect(res.body.error).toBeUndefined();
                        });
                        const comment1 = responses[0].body;
                        const comment2 = responses[1].body;

                        Promise.all([
                            // Delete comment directly
                            api.delete(dynamicPath(commentIdPath, comment1.id)),
                            // Delete user
                            api
                                .delete(
                                    dynamicPath(userIdPath, comment2.user_id)
                                )
                                .then((res) => {
                                    expect(res.status).toBe(OK);
                                    expect(res.body.error).toBeUndefined();

                                    // Confirm comment deleted which was
                                    // related to deleted user.
                                    return api.get(
                                        dynamicPath(commentIdPath, comment2.id)
                                    );
                                }),
                        ]).then((responses) => {
                            responses.forEach((res) => {
                                expect(res.status).toBe(OK);
                                expect(res.body.error).toBeUndefined();
                            });
                            done();
                        });
                    });
                });
            });
        });
    });
});
