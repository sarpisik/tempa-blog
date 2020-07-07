import { promises } from 'fs';
import sharp from 'sharp';
import { IAuthor } from '@common/entitites';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toLqip = require('lqip');

export default class UploadsService {
    private _matchExt: RegExp;

    constructor() {
        this._matchExt = /(\.\S+)(?!.*\1)/g;
    }

    generateImageFormats = async (fileName: string, filePath: string) => {
        const src = `uploads/images/${fileName}`;
        const webp = src.replace(this._matchExt, '.webp');

        // Compress temp file
        await sharp(filePath).toFile(`${process.cwd()}/${src}`);
        // Remove temp file
        await promises.unlink(filePath);
        // Create webp file
        await sharp(src).toFormat('webp').toFile(webp);
        // Create lqip string
        const lqip: string = await toLqip.base64(src);

        return { lqip, src, webp };
    };

    asyncLoop(urls: IAuthor['avatar_url'][], deletes: Promise<void>[]) {
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
}
