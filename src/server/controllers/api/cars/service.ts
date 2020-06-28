import { ICar } from './interface';
import { Table } from 'src/server/db/database';

export default class CarService {
    constructor(private _table: Table) {}

    async findMany() {
        const result = await this._table.query<ICar>(
            'SELECT * FROM cars ORDER BY model ASC'
        );
        return result.rows;
    }
    async createOne(
        car_model: string,
        car_make: string,
        car_model_year: string | number
    ) {
        const result = await this._table.query<ICar>(
            'INSERT INTO cars (model, make, model_year) VALUES ($1, $2, $3) RETURNING *',
            [car_model, car_make, car_model_year]
        );

        return result.rows[0];
    }
    async updateOne(
        id: string | number,
        { model, make, model_year }: Omit<ICar, 'id'>
    ) {
        const result = await this._table.query<ICar>(
            'UPDATE cars SET model = $1, make = $2, model_year = $3 WHERE id = $4 RETURNING *',
            [model, make, model_year, id]
        );

        return result.rows[0];
    }
    async deleteOne(id: string | number) {
        return this._table.query('DELETE FROM cars WHERE id = $1', [id]);
    }
}
