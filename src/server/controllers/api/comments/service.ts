import { IComment } from './interface';
import { Table } from 'src/server/db/database';

export default class CommentService {
    constructor(private _table: Table) {}

    async findMany() {
        const result = await this._table.query<IComment>(
            'SELECT * FROM comments ORDER BY created_at ASC'
        );
        return result.rows;
    }
    async createOne(user_id: string, post_id: string, content: string) {
        const result = await this._table.query<IComment>(
            'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
            [user_id, post_id, content]
        );

        return result.rows[0];
    }
    async updateOne(
        id: string,
        { user_id, post_id, content }: Omit<IComment, 'id'>
    ) {
        const result = await this._table.query<IComment>(
            'UPDATE comments SET user_id = $1, post_id = $2, content = $3 WHERE id = $4 RETURNING *',
            [user_id, post_id, content, id]
        );

        return result.rows[0];
    }
    async deleteOne(id: string) {
        return this._table.query('DELETE FROM comments WHERE id = $1', [id]);
    }
}
