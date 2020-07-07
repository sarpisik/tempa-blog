import { Router } from 'express';
import { AuthorController, AuthorService } from './authors';
import { BlogController, BlogService } from './blogs';
import { UserController, UserService } from './users';
import { CommentController, CommentService } from './comments';
import { UploadsController } from './uploads';

export default function generateApiControllers(
    db: ConstructorParameters<typeof AuthorService>[0]
) {
    return [
        new AuthorController(Router, new AuthorService(db)),
        new BlogController(Router, new BlogService(db)),
        new UserController(Router, new UserService(db)),
        new CommentController(Router, new CommentService(db)),
        new UploadsController(Router),
    ];
}
