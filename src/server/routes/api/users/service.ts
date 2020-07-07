import { IUser } from './interface';
import { Table } from '@db/database';

export default class UserService {
    constructor(private _table: Table) {}

    async findMany() {
        const result = await this._table.query<IUser>(
            'SELECT * FROM users ORDER BY email ASC'
        );
        return result.rows;
    }
    async createOne(name: string, email: string) {
        const result = await this._table.query<IUser>(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );

        return result.rows[0];
    }
    async updateOne(id: string, { name, email }: Omit<IUser, 'id'>) {
        const result = await this._table.query<IUser>(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );

        return result.rows[0];
    }
    async deleteOne(id: string) {
        return this._table.query('DELETE FROM users WHERE id = $1', [id]);
    }
}
