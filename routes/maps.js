"use strict";

const express = require('express');
const router  = express.Router();

module.exports = () => {

  router.get("/", (req, res) => {
    console.log(req.query)
    const templateVars = { MAP_API: process.env.MAP_API }
    res.render("map", templateVars)
  });

  return router;
}
