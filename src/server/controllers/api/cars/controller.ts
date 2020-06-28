import { Request, Response } from 'express';
import { CREATED, OK } from 'http-status-codes';

import Controller, { RouterType } from '@lib/controller';
import { BadRequestError } from '@shared/error';
import { withCatch } from '@shared/hofs';

import CarService from './service';
import { ICar } from './interface';

type CarParam = { id: string };
type CarBody = { car: ICar };

export default class CarController extends Controller {
    constructor(router: RouterType, private _carService: CarService) {
        super(router, '/api/cars');

        this._initializeRoutes();
    }

    private _initializeRoutes = () => {
        this.router.get(this.path, this._getAllCars);
        this.router.post(this.path, this._createCar);
        this.router.put(this.path + '/:id', this._updateCar);
        this.router.delete(this.path + '/:id', this._deleteCar);
    };

    private _getAllCars = withCatch<any, ICar[]>(async (_req, res) => {
        const cars = await this._carService.findMany();
        res.json(cars);
    });

    private _createCar = withCatch<any, ICar, { car?: Omit<ICar, 'id'> }>(
        async ({ body }, res) => {
            if (!body.car) throw new BadRequestError();

            const { model, make, model_year } = body.car;

            const car = await this._carService.createOne(
                model,
                make,
                model_year
            );

            res.status(CREATED).json(car);
        }
    );

    private _updateCar = withCatch<CarParam, ICar, CarBody>(
        async ({ body, params: { id } }, res) => {
            if (!body.car) throw new BadRequestError();

            const car = await this._carService.updateOne(id, body.car);

            res.status(OK).json(car);
        }
    );

    private _deleteCar = withCatch<CarParam>(
        async ({ params: { id } }: Request, res: Response) => {
            if (!id) throw new BadRequestError();

            await this._carService.deleteOne(id);

            res.sendStatus(OK);
        }
    );
}
