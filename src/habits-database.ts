import knex, { Knex } from "knex";
import { env } from "./env";

const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL
    },
    migrations: {
        extension: 'ts',
        directory: './database/migrations'
    },
    useNullAsDefault: true
}

export const db = knex(config)

export default config