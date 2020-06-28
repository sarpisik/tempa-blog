import { Router } from 'express';
import CarController from './cars/controller';
import CarService from './cars/service';

export default function generateApiControllers(
    db: ConstructorParameters<typeof CarService>[0]
) {
    return [new CarController(Router, new CarService(db))];
}
