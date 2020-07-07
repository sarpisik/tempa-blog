import multer from 'multer';
import { CREATED, OK } from 'http-status-codes';

import { IAuthor } from '@common/entitites';
import Controller, { RouterType } from '@lib/controller';
import { withCatch } from '@shared/hofs';
import UploadsService from './service';

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, '/tmp');
    },
    filename(_req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

export default class UploadsController extends Controller {
    private _uploads: ReturnType<typeof multer>;
    private _uploadsService: UploadsService;

    constructor(router: RouterType) {
        super(router, '/api/uploads');

        this._uploadsService = new UploadsService();
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

    private _uploadFile = withCatch(
        async ({ file: { filename, path } }, res) => {
            const urls = await this._uploadsService.generateImageFormats(
                filename,
                path
            );

            res.status(CREATED).json(urls);
        }
    );

    private _deleteFiles = withCatch<
        any,
        any,
        { urls: IAuthor['avatar_url'][] }
    >(async ({ body: { urls } }, res) => {
        const deletes = await this._uploadsService.asyncLoop(urls, []);

        await Promise.all(deletes);

        res.sendStatus(OK);
    });
}
