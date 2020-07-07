import { CREATED, OK } from 'http-status-codes';

import Controller, { RouterType } from '@lib/controller';
import { BadRequestError } from '@shared/error';
import { withCatch } from '@shared/hofs';

import AuthorService from './service';
import { IAuthor } from '@common/entitites';

type AuthorParam = { id: string };
type AuthorBody = { author: IAuthor };

export default class AuthorController extends Controller {
    constructor(router: RouterType, private _authorService: AuthorService) {
        super(router, '/api/authors');

        this._initializeRoutes();
    }

    private _initializeRoutes = () => {
        this.router.get(this.path, this._getAuthors);
        this.router.post(this.path, this._createAuthor);
        this.router.delete(this.path, this._deleteAuthors);
        this.router.put(this.path + '/:id', this._updateAuthor);
        this.router.delete(this.path + '/:id', this._deleteAuthor);
    };

    private _getAuthors = withCatch<any, IAuthor[]>(async (_req, res) => {
        const authors = await this._authorService.findMany();
        res.json(authors);
    });

    private _createAuthor = withCatch<
        any,
        IAuthor,
        { author?: Omit<IAuthor, 'id'> }
    >(async ({ body }, res) => {
        if (!body.author) throw new BadRequestError();

        const { email, name, avatar_url, bio } = body.author;

        const author = await this._authorService.createOne(
            email,
            name,
            avatar_url,
            bio
        );

        res.status(CREATED).json(author);
    });

    private _updateAuthor = withCatch<AuthorParam, IAuthor, AuthorBody>(
        async ({ body, params: { id } }, res) => {
            if (!body.author) throw new BadRequestError();

            const author = await this._authorService.updateOne(id, body.author);

            res.status(OK).json(author);
        }
    );

    private _deleteAuthor = withCatch<AuthorParam>(
        async ({ params: { id } }, res) => {
            if (!id) throw new BadRequestError();

            await this._authorService.deleteOne(id);

            res.sendStatus(OK);
        }
    );

    private _deleteAuthors = withCatch<any, any, { ids: IAuthor['id'][] }>(
        async ({ body: { ids } }, res) => {
            if (!ids) throw new BadRequestError();

            await this._authorService.deleteMany(ids);

            res.sendStatus(OK);
        }
    );
}