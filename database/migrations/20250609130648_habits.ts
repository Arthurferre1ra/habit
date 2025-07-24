import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('habits', (table) => {
        table.uuid('habitId')
        table.string('habit').notNullable()
        table.string('category')
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('habits')
}

