import { Router } from 'express';
import { AuthorController, AuthorService } from './authors';
import { BlogController, BlogService } from './blogs';

export default function generateApiControllers(
    db: ConstructorParameters<typeof AuthorService>[0]
) {
    return [
        new AuthorController(Router, new AuthorService(db)),
        new BlogController(Router, new BlogService(db)),
    ];
}
