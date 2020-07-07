import { promises } from 'fs';
import { CREATED, OK } from 'http-status-codes';
import multer from 'multer';
import sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toLqip = require('lqip');

import Controller, { RouterType } from '@lib/controller';
import { withCatch } from '@shared/hofs';
import { IAuthor } from '@common/entitites';

const MATCH_EXT = /(\.\S+)(?!.*\1)/g;

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
        const src = `uploads/images/${req.file.filename}`;
        const webp = src.replace(MATCH_EXT, '.webp');

        // Compress temp file
        await sharp(req.file.path).toFile(`${process.cwd()}/${src}`);
        // Remove temp file
        await promises.unlink(req.file.path);
        // Create webp file
        await sharp(src).toFormat('webp').toFile(webp);
        // Create lqip string
        const lqip: string = await toLqip.base64(src);

        res.status(CREATED).json({ lqip, src, webp });
    });

    private _deleteFiles = withCatch<
        any,
        any,
        { urls: IAuthor['avatar_url'][] }
    >(async ({ body: { urls } }, res) => {
        const deletes = await asyncLoop(urls, []);

        await Promise.all(deletes);

        res.sendStatus(OK);
    });
}

function asyncLoop(urls: IAuthor['avatar_url'][], deletes: Promise<void>[]) {
    function cb(i: number, resolve: (value?: Promise<void>[]) => void) {
        if (i < urls.length) {
            const { src, webp } = urls[i];

            deletes.push(promises.unlink(src));
            deletes.push(promises.unlink(webp));

            setImmediate(() => {
                cb(++i, resolve);
            });
        } else {
            resolve(deletes);
        }
    }

    return new Promise<Promise<void>[]>((resolve, reject) => {
        try {
            cb(0, resolve);
        } catch (error) {
            reject(error);
        }
    });
}
