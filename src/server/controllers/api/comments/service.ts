import { IComment } from './interface';
import { Table } from '@db/database';

export default class CommentService {
    constructor(private _table: Table) {}

    async findMany() {
        const result = await this._table.query<IComment>(
            'SELECT * FROM comments ORDER BY created_at ASC'
        );
        return result.rows;
    }
    async findOne(id: string) {
        const result = await this._table.query<IComment>(
            'SELECT * FROM comments WHERE id = $1',
            [id]
        );

        return result.rows[0];
    }
    async createOne(user_id: string, blog_id: string, content: string) {
        const result = await this._table.query<IComment>(
            'INSERT INTO comments (user_id, blog_id, content) VALUES ($1, $2, $3) RETURNING *',
            [user_id, blog_id, content]
        );

        return result.rows[0];
    }
    async updateOne(
        id: string,
        { user_id, blog_id, content }: Omit<IComment, 'id'>
    ) {
        const result = await this._table.query<IComment>(
            'UPDATE comments SET user_id = $1, blog_id = $2, content = $3 WHERE id = $4 RETURNING *',
            [user_id, blog_id, content, id]
        );

        return result.rows[0];
    }
    async deleteOne(id: string) {
        return this._table.query('DELETE FROM comments WHERE id = $1', [id]);
    }
}
