import { Knex } from 'knex'

// up => O que vai ser feito no db
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

// down => Rollback
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
