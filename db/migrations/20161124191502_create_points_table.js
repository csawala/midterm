exports.up = function(knex, Promise) {
  return knex.schema.createTable('points', function (table) {
    table.integer('mapid');
    table.specificType('loc', 'geometry(point, 4326)');
    table.string('title');
    table.string('info');
    table.integer('createdby');
    table.string('image');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('points');
};



// ORIGINAL CODE FROM NET FOR CREATING POINT
// table.specificType('point', 'geometry(point, 4326)');