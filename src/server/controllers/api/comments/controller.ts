import { Request, Response } from 'express';
import { CREATED, OK } from 'http-status-codes';

import Controller, { RouterType } from '@lib/controller';
import { BadRequestError } from '@shared/error';
import { withCatch } from '@shared/hofs';

import CommentService from './service';
import { IComment } from './interface';

type CommentParam = { id: string };
type CommentBody = { comment: IComment };

export default class CommentController extends Controller {
    constructor(router: RouterType, private _commentService: CommentService) {
        super(router, '/api/comments');

        this._initializeRoutes();
    }

    private _initializeRoutes = () => {
        this.router.get(this.path, this._getAllComments);
        this.router.post(this.path, this._createComment);
        this.router.put(this.path + '/:id', this._updateComment);
        this.router.delete(this.path + '/:id', this._deleteComment);
    };

    private _getAllComments = withCatch<any, IComment[]>(async (_req, res) => {
        const comments = await this._commentService.findMany();
        res.json(comments);
    });

    private _createComment = withCatch<
        any,
        IComment,
        { comment?: Omit<IComment, 'id'> }
    >(async ({ body }, res) => {
        if (!body.comment) throw new BadRequestError();

        const { user_id, blog_id, content } = body.comment;

        const comment = await this._commentService.createOne(
            user_id,
            blog_id,
            content
        );

        res.status(CREATED).json(comment);
    });

    private _updateComment = withCatch<CommentParam, IComment, CommentBody>(
        async ({ body, params: { id } }, res) => {
            if (!body.comment) throw new BadRequestError();

            const comment = await this._commentService.updateOne(
                id,
                body.comment
            );

            res.status(OK).json(comment);
        }
    );

    private _deleteComment = withCatch<CommentParam>(
        async ({ params: { id } }: Request, res: Response) => {
            if (!id) throw new BadRequestError();

            await this._commentService.deleteOne(id);

            res.sendStatus(OK);
        }
    );
}
