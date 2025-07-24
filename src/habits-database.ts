import knex, { Knex } from "knex";

const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: './database/habits-database.db'
    },
    migrations: {
        extension: 'ts',
        directory: './database/migrations'
    },
    useNullAsDefault: true
}

export const db = knex(config)

export default config