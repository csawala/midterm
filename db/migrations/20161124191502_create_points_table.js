exports.up = function(knex, Promise) {
  return knex.schema.createTable('points', function (table) {
    table.specificType('loc', 'point');
    table.string('title');
    table.string('info');
    table.integer('createdby');
    table.string('image');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('points');
};




  // table.specificType('point', 'geometry(point, 4326)');