import { IAuthor, PreAuthor } from '@common/entitites';
import {
    DeleteRequest,
    GetRequest,
    PostRequest,
    PutRequest,
} from '@lib/requests';

class AuthorsApi {
    url: string;

    constructor() {
        this.url = '/authors';
    }

    getAuthors() {
        const getRequest = new GetRequest(this.url);

        return getRequest.sendJson<IAuthor[]>();
    }

    postAuthor(author: PreAuthor) {
        const postRequest = new PostRequest(this.url, {
            body: { author },
        });

        return postRequest.sendJson<IAuthor>();
    }

    putAuthor({ id, ...author }: IAuthor) {
        const putRequest = new PutRequest(`${this.url}/${id}`, {
            body: { author },
        });

        return putRequest.sendJson<IAuthor>();
    }

    deleteAuthor(id: IAuthor['id']) {
        const deleteRequest = new DeleteRequest(`${this.url}/${id}`);

        return deleteRequest.send();
    }

    deleteAuthors(ids: IAuthor['id'][]) {
        const deleteRequest = new DeleteRequest(this.url, {
            body: { ids },
        });

        return deleteRequest.send();
    }
}

export default new AuthorsApi();
