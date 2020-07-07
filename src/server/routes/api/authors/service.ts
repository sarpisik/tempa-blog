import { IAuthor } from '@common/entitites';
import { Table } from '@db/database';

export default class AuthorService {
    constructor(private _table: Table) {}

    async findMany() {
        const result = await this._table.query<IAuthor>(
            'SELECT * FROM authors ORDER BY name ASC'
        );
        return result.rows;
    }
    async createOne(
        email: IAuthor['email'],
        name: IAuthor['name'],
        avatar_url: IAuthor['avatar_url'],
        bio: IAuthor['bio']
    ) {
        const result = await this._table.query<IAuthor>(
            'INSERT INTO authors (email, name, avatar_url, bio) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, name, avatar_url, bio]
        );

        return result.rows[0];
    }
    async updateOne(
        id: string,
        { email, name, avatar_url, bio }: Omit<IAuthor, 'id'>
    ) {
        const result = await this._table.query<IAuthor>(
            'UPDATE authors SET email = $1, name = $2, avatar_url = $3, bio = $4 WHERE id = $5 RETURNING *',
            [email, name, avatar_url, bio, id]
        );

        return result.rows[0];
    }
    async deleteOne(id: string) {
        return this._table.query('DELETE FROM authors WHERE id = $1', [id]);
    }
    async deleteMany(ids: string[]) {
        const idList = ids.map((_, i) => `$${i + 1}`).join(',');
        return this._table.query(
            `DELETE FROM authors WHERE id IN (${idList})`,
            ids
        );
    }
}
