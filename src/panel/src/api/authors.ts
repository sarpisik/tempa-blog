import { IAuthor, PreAuthor } from '@common/entitites';
import { PostRequest, GetRequest } from '@lib/requests';

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
            // TODO: Set correct avatar url
            body: { author: { ...author, avatar_url: '' } },
        });

        return postRequest.sendJson<IAuthor>();
    }
}

export default new AuthorsApi();
