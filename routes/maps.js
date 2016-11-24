"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    const templateVars = { MAP_API: process.env.MAP_API }
    res.render("map", templateVars)
  });

  router.post("/map", (req, res) => {
    const position = req.body
    knex.insert("position")
    //code here

  })

  return router;
}
