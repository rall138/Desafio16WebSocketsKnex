/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('mensajes', table => {
    table.increments('id')
    table.string('mensaje', 255).notNullable()
    table.string('correo', 255).notNullable()
    table.timestamps()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('mensajes')
};
