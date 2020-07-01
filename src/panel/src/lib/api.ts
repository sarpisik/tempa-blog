import { IAuthor } from '@common/entitites';

const URL =
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') +
    '/api';

export default class Api {
    postAuthor(data: Omit<IAuthor, 'id'>) {
        return fetch(URL, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then<IAuthor>((res) => res.json());
    }
}
