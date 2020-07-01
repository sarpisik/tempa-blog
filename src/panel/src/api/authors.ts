import { IAuthor, PreAuthor } from '@common/entitites';
import { PostRequest } from '@lib/requests';

class AuthorsApi {
    url: string;

    constructor() {
        this.url = '/authors';
    }

    postAuthor(author: PreAuthor) {
        const postRequest = new PostRequest(this.url, { body: { author } });

        return postRequest.sendJson<IAuthor>();
    }
}

export default new AuthorsApi();
