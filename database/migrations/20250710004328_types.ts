import { table } from "console";
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('types', (table) => {
        table.string('type')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('types')
}

