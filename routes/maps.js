"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    console.log(req.query)
    const templateVars = { MAP_API: process.env.MAP_API }
    res.render("map", templateVars)
  });

  router.get("/view/:title/:info", (req, res) => {
    const tempateVars = {
      MAP_API: process.env.MAP_API,
      title: req.params.title,
      info: req.params.info
    }
    res.render("map", templateVars)
  })

//This is the post that receive the marker object. It only console
//logs for now, we need to add to database.
  router.post("/marker", (req, res) => {
    console.log("gotcha")
    res.status(200)
    const body = req.body
    console.log("this is the body:", body)
  })

  router.get("/mapbox", (req, res) => {
    const templateVars = {MAP_BOX_API_PRIVATE: process.env.MAP_BOX_API_PRIVATE,
      MAP_BOX_API_PUBLIC: process.env.MAP_BOX_API_PUBLIC}
    res.render("mapbox", templateVars)
  })


  router.post("/mapInfo", (req, res) => {
    console.log(req.body);
    knex('maps')
    .insert({
    title: req.body.title,
    info: req.body.info
    })
    .then(() => {
    })
  res.redirect("/api/maps")
})

  return router;
}
