"use strict";

const express = require('express')
const router  = express.Router()
const bodyParser  = require("body-parser")
const app = express()
const table = require('../public/scripts/db-access')

app.use(bodyParser.urlencoded({ extended: true }))



module.exports = (knex) => {
  const st = require('knex-postgis')(knex)

  router.get("/", (req, res) => {
    console.log(req.query)
    const templateVars = { MAP_API: process.env.MAP_API }
    res.render("map", templateVars)
  });

  router.post("/map", (req, res) => {
    console.log("body: ", req.body)
    let data = {
      coordX: Number(req.body.pointX),
      coordY: Number(req.body.pointY),
      mapid: 3,
      createdby: 3,
      title: 'Clean Git',
      info: 'description from clean git',
      image: 'http://aruizca.com/content/images/git-clean.png'
    }


    table.writeToPoints(data)
    let dataPull = table.readFromPoints()

    console.log(dataPull)

    // knex.insert({
    //   mapid: 2,
    //   loc: st.geomFromText(`Point(${coordX} ${coordY})`, 4326),
    //   title: 'testing title',
    //   info: 'testing description',
    //   createdby: 2,
    //   image: 'http://www.img.com'
    // }).into('points')
    // .then(() => {
    //   knex.select('*', st.asText('loc')).from('points')
    //   .then((event) => {
    //     console.log(event)
    //   })
    // })
  })

  router.get("/mapbox", (req, res) => {
    const templateVars = {MAP_BOX_API_PRIVATE: process.env.MAP_BOX_API_PRIVATE,
      MAP_BOX_API_PUBLIC: process.env.MAP_BOX_API_PUBLIC}
    res.render("mapbox", templateVars)
  })


  return router;
}
