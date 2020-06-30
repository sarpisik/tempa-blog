import { IAuthor } from './interface';
import { Table } from '@db/database';

export default class AuthorService {
    constructor(private _table: Table) {}

    async findMany() {
        const result = await this._table.query<IAuthor>(
            'SELECT * FROM authors ORDER BY name ASC'
        );
        return result.rows;
    }
    async createOne(name: string, avatar_url: string, description: string) {
        const result = await this._table.query<IAuthor>(
            'INSERT INTO authors (name, avatar_url, description) VALUES ($1, $2, $3) RETURNING *',
            [name, avatar_url, description]
        );

        return result.rows[0];
    }
    async updateOne(
        id: string,
        { name, avatar_url, description }: Omit<IAuthor, 'id'>
    ) {
        const result = await this._table.query<IAuthor>(
            'UPDATE authors SET name = $1, avatar_url = $2, description = $3 WHERE id = $4 RETURNING *',
            [name, avatar_url, description, id]
        );

        return result.rows[0];
    }
    async deleteOne(id: string) {
        return this._table.query('DELETE FROM authors WHERE id = $1', [id]);
    }
}
