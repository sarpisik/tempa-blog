import { Router } from 'express';
import AuthorController from './authors/controller';
import AuthorService from './authors/service';

export default function generateApiControllers(
    db: ConstructorParameters<typeof AuthorService>[0]
) {
    return [new AuthorController(Router, new AuthorService(db))];
}
