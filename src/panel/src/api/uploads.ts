import { DeleteRequest, PostRequestFile } from '@lib/requests';

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

    deleteUploads(urls: string[]) {
        const deleteRequest = new DeleteRequest(this._url, {
            body: { urls },
        });

        return deleteRequest.send();
    }
}

export default new UploadsApi();
