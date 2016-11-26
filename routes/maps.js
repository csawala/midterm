"use strict";

const express = require('express')
const router  = express.Router()
const bodyParser  = require("body-parser")
const app = express()
const table = require('../public/scripts/db-access')

app.use(bodyParser.urlencoded({ extended: true }))



module.exports = (knex) => {
  const st = require('knex-postgis')(knex)      // ALLOWS FOR postGIS CALCULATIONS

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

  router.get("/markers", (req, res) => {
    knex.select('*', st.asText('loc')).from('points')
    .then((results) => {
      res.json(results)
    })
  })

  router.post("/marker", (req, res) => {
    res.status(200)
    const body = req.body
    console.log("this is the body:", body)
    marker.push(body)
    let data = req.body
    let output

    knex.insert({
      mapid: data.mapid,
      loc: st.geomFromText(`Point(${Number(data.lat)} ${Number(data.lng)})`, 4326),
      title: data.title,
      info: data.description,
      createdby: data.userid,
      image: data.image
    }).into('points')
    // .then(() => {        // this will display POINT info from database
    //   knex.select('*', st.asText('loc')).from('points')
    //   .then((results) => {
    //     output = results
    //   })
    //   .then(() => {
    //     console.log("points print: ", output)
    //   })
    // })
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
