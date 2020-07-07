import { promises } from 'fs';
import { CREATED, OK } from 'http-status-codes';
import multer from 'multer';
import sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toLqip = require('lqip');

import Controller, { RouterType } from '@lib/controller';
import { withCatch } from '@shared/hofs';

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
        const tempFilePath = req.file.filename;
        const src = `uploads/images/${tempFilePath}`;
        const fileOutput = `${process.cwd()}/${src}`;
        const { format } = await sharp(req.file.path).toFile(fileOutput);
        const webp = `${src}.webp`;
        await sharp(src).toFormat('webp').toFile(fileOutput);
        const lqip: string = await toLqip(`${src}.${format}`);
        await promises.unlink(tempFilePath);

        res.status(CREATED).json({ src, webp, lqip });
    });

    private _deleteFiles = withCatch<any, any, { urls: string[] }>(
        async ({ body: { urls } }, res) => {
            await Promise.all(urls.map(promises.unlink));

            res.sendStatus(OK);
        }
    );
}
