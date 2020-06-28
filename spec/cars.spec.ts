import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';

import { pErr } from '@shared/functions';
import { paramMissingError } from '@shared/constants';
import CarService from 'src/server/controllers/api/cars/service';
import server from '@server';

describe('Cars Routes', () => {
    const carsPath = '/api/cars';
    const addcarsPath = `${carsPath}`;
    const updateCarPath = `${carsPath}/:id`;
    const deleteCarPath = `${carsPath}/:id`;

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        server().then((app) => {
            agent = supertest.agent(app);

            done();
        });
    });

    describe(`"GET:${carsPath}"`, () => {
        const cars = [
            {
                id: 1,
                model: 'Scirocco',
                make: 'Volkswagen',
                model_year: 1988,
            },
        ];
        it(`should return a JSON object with all the cars and a status code of "${OK}" if the
            request was successful.`, (done) => {
            spyOn(CarService.prototype, 'findMany').and.resolveTo(cars);
            agent.get(carsPath).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(cars);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not fetch cars.';
            spyOn(CarService.prototype, 'findMany').and.throwError(errMsg);

            agent.get(carsPath).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"POST:${addcarsPath}"`, () => {
        const callApi = (reqBody: Record<string, unknown>) => {
            return agent.post(addcarsPath).type('form').send(reqBody);
        };

        const body = {
            car: {
                model: 'Scirocco',
                make: 'Volkswagen',
                model_year: 1988,
            },
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            const keys = Object.keys(body.car) as Array<
                keyof typeof body['car']
            >;
            spyOn(CarService.prototype, 'createOne').and.resolveTo({
                ...body.car,
                id: 1,
            });

            agent
                .post(addcarsPath)
                .type('form')
                .send(body) // pick up here
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    keys.forEach((key) => {
                        expect(body.car[key]).toBe(res.body[key]);
                    });
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON Record<string, unknown> with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the car param was missing.`, (done) => {
            callApi({}).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const errMsg = 'Could not add car.';
            spyOn(CarService.prototype, 'createOne').and.throwError(errMsg);

            callApi(body).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });

    describe(`"PUT:${updateCarPath}"`, () => {
        const callApi = (id: number, reqBody: Record<string, unknown>) => {
            return agent
                .put(updateCarPath.replace(':id', id.toString()))
                .type('form')
                .send(reqBody);
        };

        const body = {
            car: {
                id: 10,
                model: 'Scirocco',
                make: 'Volkswagen',
                model_year: 1988,
            },
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(CarService.prototype, 'updateOne').and.resolveTo(body.car);

            callApi(body.car.id, body).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body).toEqual(body.car);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the car param was missing.`, (done) => {
            callApi(body.car.id, {}).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(paramMissingError);
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const updateErrMsg = 'Could not update car.';
            spyOn(CarService.prototype, 'updateOne').and.throwError(
                updateErrMsg
            );

            callApi(body.car.id, body).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(updateErrMsg);
                done();
            });
        });
    });

    describe(`"DELETE:${deleteCarPath}"`, () => {
        const callApi = (id: number) => {
            return agent.delete(deleteCarPath.replace(':id', id.toString()));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            spyOn(CarService.prototype, 'deleteOne').and.resolveTo();

            callApi(5).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            const deleteErrMsg = 'Could not delete car.';
            spyOn(CarService.prototype, 'deleteOne').and.throwError(
                deleteErrMsg
            );

            callApi(1).end((err: Error, res: Response) => {
                pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(deleteErrMsg);
                done();
            });
        });
    });
});
