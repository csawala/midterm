exports.up = function(knex, Promise) {
  return knex.schema.createTable('usermaps', function (table) {
    table.integer('userid');
    table.integer('mapid');
    table.boolean('fav');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('usermaps');
};