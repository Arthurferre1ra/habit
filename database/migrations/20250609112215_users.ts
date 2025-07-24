import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('userId')
        table.string('userName').notNullable()
        table.string('document').notNullable().unique()
        table.string('email').notNullable().unique()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

