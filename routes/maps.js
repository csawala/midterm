"use strict";

const express = require('express');
const router  = express.Router();

module.exports = () => {

  router.get("/", (req, res) => {
    const templateVars = {API_MAP: process.env }
    console.log("this is process.env:", process.env)
    console.log("this is map. api:", process.env.HOST)
    res.render("map")
  });

  return router;
}
