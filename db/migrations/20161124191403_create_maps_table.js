
exports.up = function(knex, Promise) {
  return knex.schema.createTable('maps', function (table) {
    table.increments();
    table.string('title');
    table.string('info');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('maps');
};
