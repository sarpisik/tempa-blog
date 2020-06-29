import { Request, Response } from 'express';
import { CREATED, OK } from 'http-status-codes';

import Controller, { RouterType } from '@lib/controller';
import { BadRequestError } from '@shared/error';
import { withCatch } from '@shared/hofs';

import BlogService from './service';
import { IBlog } from './interface';

type BlogParam = { id: string };
type BlogBody = { blog: IBlog };

export default class BlogController extends Controller {
    constructor(router: RouterType, private _blogService: BlogService) {
        super(router, '/api/blogs');

        this._initializeRoutes();
    }

    private _initializeRoutes = () => {
        this.router.get(this.path, this._getBlogs);
        this.router.post(this.path, this._createBlog);
        this.router.get(this.path + '/:id', this._getBlog);
        this.router.put(this.path + '/:id', this._updateBlog);
        this.router.delete(this.path + '/:id', this._deleteBlog);
    };

    private _getBlogs = withCatch<any, IBlog[]>(async (_req, res) => {
        const blogs = await this._blogService.findMany();
        res.json(blogs);
    });

    private _getBlog = withCatch<BlogParam, IBlog, BlogBody>(
        async ({ params: { id } }, res) => {
            const blog = await this._blogService.findOne(id);

            res.status(OK).json(blog);
        }
    );

    private _createBlog = withCatch<any, IBlog, { blog?: Omit<IBlog, 'id'> }>(
        async ({ body }, res) => {
            if (!body.blog) throw new BadRequestError();

            const { author_id, status, content } = body.blog;

            const blog = await this._blogService.createOne(
                author_id,
                status,
                content
            );

            res.status(CREATED).json(blog);
        }
    );

    private _updateBlog = withCatch<BlogParam, IBlog, BlogBody>(
        async ({ body, params: { id } }, res) => {
            if (!body.blog) throw new BadRequestError();

            const blog = await this._blogService.updateOne(id, body.blog);

            res.status(OK).json(blog);
        }
    );

    private _deleteBlog = withCatch<BlogParam>(
        async ({ params: { id } }: Request, res: Response) => {
            if (!id) throw new BadRequestError();

            await this._blogService.deleteOne(id);

            res.sendStatus(OK);
        }
    );
}
