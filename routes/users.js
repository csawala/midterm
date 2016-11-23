"use strict";

const express = require('express');
const router  = express.Router();

const knex = (knex) => {

 router.get("/", (req, res) => {
   knex
     .select("*")
     .from("users")
     .then((results) => {
       res.json(results);
   });
 });

 return router;
}

module.exports = {
 knex: knex
}
