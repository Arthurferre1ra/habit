import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('habits', (table) => {
        table.uuid('sessionId').after('habitId').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('sessionId')
}

