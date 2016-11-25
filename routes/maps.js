"use strict";

const express = require('express');
const router  = express.Router();
const bodyParser  = require("body-parser");
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));


module.exports = (knex) => {
  const st = require('knex-postgis')(knex)

  router.get("/", (req, res) => {
    const templateVars = { MAP_API: process.env.MAP_API }
    res.render("map", templateVars)
  });

  router.post("/map", (req, res) => {
    console.log("body: ", req.body)
    let coordX = Number(req.body.pointX)
    let coordY = Number(req.body.pointY)
    console.log(coordX, coordY)
    // let userId = req.body.
    // let mapId = req.body.
    // let title = req.body.
    // let desc = req.body.
    // let img = req.body.


    knex.insert({
      mapid: 2,
      loc: st.geomFromText(`Point(${coordX} ${coordY})`, 4326),
      title: 'testing title',
      info: 'testing description',
      createdby: 2,
      image: 'http://www.img.com'
    }).into('points')
    .then(() => {
      knex.select('*', st.asText('loc')).from('points')
      .then((event) => {
        console.log(event)
      })
    })
  })

  router.get("/mapbox", (req, res) => {
    const templateVars = {MAP_BOX_API_PRIVATE: process.env.MAP_BOX_API_PRIVATE,
      MAP_BOX_API_PUBLIC: process.env.MAP_BOX_API_PUBLIC}
    res.render("mapbox", templateVars)
  })


  return router;
}
