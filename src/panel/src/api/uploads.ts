import { DeleteRequest, PostRequestFile } from '@lib/requests';
import { ImageFormats } from '@common/entitites';

class UploadsApi {
    private _url: string;

    constructor() {
        this._url = '/uploads';
    }

    postUpload<R>(body: FormData) {
        const postRequest = new PostRequestFile(this._url, {
            body,
        });

        return postRequest.send<R>();
    }

    deleteUploads(urls: ImageFormats[]) {
        const deleteRequest = new DeleteRequest(this._url, {
            body: { urls },
        });

        return deleteRequest.send();
    }
}

export default new UploadsApi();
