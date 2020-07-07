import { Router } from 'express';
import HomePageController from './home';
import AboutPageController from './about';

export const pageControllers = [
    new HomePageController(Router),
    new AboutPageController(Router),
];
