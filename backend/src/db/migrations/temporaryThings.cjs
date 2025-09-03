exports.up = async function (knex) {
  await knex.schema.alterTable('Payments', (table) => {
    table.timestamp('updated_at').defaultTo(knex.fn.now()).onUpdate(knex.fn.now());
  });
}

exports.down = async function (knex) {
  await knex.schema.alterTable('Payments', (table) => {
    table.dropColumn('updated_at');
  });
}
