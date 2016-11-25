// ======== SEED TABLE FOR DATABASE =========== //
// SQL FORMATTING
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
  );

CREATE TABLE maps (
  id INTEGER PRIMARY KEY,
  title VARCHAR(255),
  info VARCHAR(255)
  );

CREATE TABLE points (
  loc POINT NOT NULL,
  title VARCHAR(255),
  info VARCHAR(255),
  createdby INTEGER,
  image VARCHAR(255)
  );

CREATE TABLE usermaps (
  userid INTEGER,
  mapid INTEGER,
  fav BOOLEAN
  );


// USER TABLE
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('email');
    table.string('password');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};

// MAP TABLE
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

// POINTS TABLE
exports.up = function(knex, Promise) {
  return knex.schema.createTable('points', function (table) {
    table.string('email');
    table.string('password');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};

// 46 Spadina Ave, Toronto
// 43.644643, -79.394999