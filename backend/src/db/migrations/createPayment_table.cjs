/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Projects
  await knex.schema.createTable("Projects", (table) => {
    table.increments("project_id").primary();
    table.string("project_url", 255).notNullable();
    table.string("secret_key", 255).unique().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // PaymentUsers
  await knex.schema.createTable("PaymentUsers", (table) => {
    table.increments("payment_user_id").primary();
    table.integer("project_id").unsigned().references("project_id").inTable("Projects").onDelete("CASCADE");
    table.string("email", 255).unique().notNullable();
    table.string("phone", 20);
    table.string("external_user_id", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Charges
  await knex.schema.createTable("Charges", (table) => {
    table.string("charge_id", 255).primary();
    table.decimal("amount", 10, 2).notNullable();
    table.string("currency", 10).notNullable();
    table.string("status", 50).notNullable();
    table.string("payment_method", 100);
    table.string("receipt_url", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Payments
  await knex.schema.createTable("Payments", (table) => {
    table.increments("payment_id").primary();
    table.integer("project_id").unsigned().references("project_id").inTable("Projects").onDelete("CASCADE");
    table.string("charge_id", 255).references("charge_id").inTable("Charges").onDelete("SET NULL");
    table.integer("payment_user_id").unsigned().references("payment_user_id").inTable("PaymentUsers").onDelete("CASCADE");
    table.string("order_id", 255);
    table.string("stripe_payment_intent_id", 255).unique();
    table.string("stripe_checkout_session_id", 255).unique();
    table.decimal("amount", 10, 2);
    table.string("currency", 10);
    table.string("status", 50);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // WebhookEvents
  await knex.schema.createTable("WebhookEvents", (table) => {
    table.string("event_id", 255).primary();
    table.integer("project_id").unsigned().references("project_id").inTable("Projects").onDelete("CASCADE");
    table.integer('payment_id').unsigned().references("payment_id").inTable("Payments");
    table.string("type", 100);
    table.string("object_id", 255);
    table.json("payload");
    table.timestamp("received_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("WebhookEvents");
  await knex.schema.dropTableIfExists("Payments");
  await knex.schema.dropTableIfExists("Charges");
  await knex.schema.dropTableIfExists("PaymentUsers");
  await knex.schema.dropTableIfExists("Projects");
}
