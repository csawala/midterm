"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const expressLayouts = require('express-ejs-layouts');


const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');



// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  keys: ['totally secret stuff']
  }));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/maps", mapsRoutes(knex));


// app.get("/", (req, res) => {
//   knex
//   .select("title", "maps.id")
//   .from("maps")
//   .innerJoin('users', 'maps.id', 'users.id')
//   .then((results) => {
//     res.json(results);
// });
// });


// Home page
app.get("/", (req, res) => {
  knex
    .select("title", "info")
    .from("maps")
    .then((results) => {
      let templateVars = {
        maps: results
      }
      // res.json(results)
    console.log(results);
    res.render("index", templateVars);
    });
});




app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
