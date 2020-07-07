import multer from 'multer';
import { CREATED, OK } from 'http-status-codes';

import Controller, { RouterType } from '@lib/controller';
import { withCatch } from '@shared/hofs';
import { promises } from 'fs';

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, 'uploads/images');
    },
    filename(_req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

export default class UploadsController extends Controller {
    private _uploads: ReturnType<typeof multer>;

    constructor(router: RouterType) {
        super(router, '/api/uploads');

        this._uploads = multer({ storage });

        this._initializeRoutes();
    }

    private _initializeRoutes = () => {
        this.router.post(
            this.path,
            this._uploads.single('image'),
            this._uploadFile
        );
        this.router.delete(this.path, this._deleteFiles);
    };

    private _uploadFile = withCatch(async (req, res) => {
        const url = req.file.path;

        res.status(CREATED).json({ url });
    });

    private _deleteFiles = withCatch<any, any, { urls: string[] }>(
        async ({ body: { urls } }, res) => {
            await Promise.all(urls.map(promises.unlink));

            res.sendStatus(OK);
        }
    );
}
