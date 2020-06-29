import { Pool, PoolClient } from 'pg';
import * as queries from './queries';
import { env } from '../LoadEnv';

export const pool = new Pool({
    user: env.POSTGRES_USER,
    host: env.POSTGRES_HOST,
    database: env.POSTGRES_DB,
    password: env.PGADMIN_DEFAULT_PASSWORD,
    port: parseInt(env.POSTGRES_PORT),
});

async function initializeDb(pool: PoolClient) {
    for (const query of Object.values(queries)) {
        await pool.query(query);
    }

    return pool;
}

export type Table = PoolClient;

export default function database() {
    return pool.connect().then(initializeDb);
}
