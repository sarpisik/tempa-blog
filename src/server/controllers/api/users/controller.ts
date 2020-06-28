import { Request, Response } from 'express';
import { CREATED, OK } from 'http-status-codes';

import Controller, { RouterType } from '@lib/controller';
import { BadRequestError } from '@shared/error';
import { withCatch } from '@shared/hofs';

import UserService from './service';
import { IUser } from './interface';

type UserParam = { id: string };
type UserBody = { user: IUser };

export default class UserController extends Controller {
    constructor(router: RouterType, private _userService: UserService) {
        super(router, '/api/users');

        this._initializeRoutes();
    }

    private _initializeRoutes = () => {
        this.router.get(this.path, this._getAllUsers);
        this.router.post(this.path, this._createUser);
        this.router.put(this.path + '/:id', this._updateUser);
        this.router.delete(this.path + '/:id', this._deleteUser);
    };

    private _getAllUsers = withCatch<any, IUser[]>(async (_req, res) => {
        const users = await this._userService.findMany();
        res.json(users);
    });

    private _createUser = withCatch<any, IUser, { user?: Omit<IUser, 'id'> }>(
        async ({ body }, res) => {
            if (!body.user) throw new BadRequestError();

            const { name, email } = body.user;

            const user = await this._userService.createOne(name, email);

            res.status(CREATED).json(user);
        }
    );

    private _updateUser = withCatch<UserParam, IUser, UserBody>(
        async ({ body, params: { id } }, res) => {
            if (!body.user) throw new BadRequestError();

            const user = await this._userService.updateOne(id, body.user);

            res.status(OK).json(user);
        }
    );

    private _deleteUser = withCatch<UserParam>(
        async ({ params: { id } }: Request, res: Response) => {
            if (!id) throw new BadRequestError();

            await this._userService.deleteOne(id);

            res.sendStatus(OK);
        }
    );
}
