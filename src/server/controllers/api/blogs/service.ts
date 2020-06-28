import { IBlog } from './interface';
import { Table } from 'src/server/db/database';

export default class BlogService {
    constructor(private _table: Table) {}

    async findMany() {
        const result = await this._table.query<IBlog>(
            'SELECT * FROM blogs ORDER BY created_at ASC'
        );
        return result.rows;
    }
    async createOne(
        author_id: string,
        status: IBlog['status'],
        content: string
    ) {
        const result = await this._table.query<IBlog>(
            'INSERT INTO blogs (author_id, status, content) VALUES ($1, $2, $3) RETURNING *',
            [author_id, status, content]
        );

        return result.rows[0];
    }
    async updateOne(
        id: string,
        { author_id, status, content }: Omit<IBlog, 'id'>
    ) {
        const result = await this._table.query<IBlog>(
            'UPDATE blogs SET author_id = $1, status = $2, content = $3 WHERE id = $4 RETURNING *',
            [author_id, status, content, id]
        );

        return result.rows[0];
    }
    async deleteOne(id: string) {
        return this._table.query('DELETE FROM blogs WHERE id = $1', [id]);
    }
}
