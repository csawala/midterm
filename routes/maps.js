"use strict";

const express = require('express')
const router  = express.Router()
const bodyParser  = require("body-parser")
const app = express()
const table = require('../public/scripts/db-access')

app.use(bodyParser.urlencoded({ extended: true }))



module.exports = (knex) => {
  const st = require('knex-postgis')(knex)      // ALLOWS FOR postGIS CALCULATIONS

// this route gets query parameters from what is inserted into the mab submit form
// we needed this to access tge query params at api/maps

  router.get("/", (req, res) => {
    const templateVars = {
      title: req.query.title,
      info: req.query.info,
      MAP_API: process.env.MAP_API,
      FILESTACK_API: process.env.FILESTACK_API
    }
      console.log(templateVars);

    res.render("map", templateVars)
  });


  router.get("/view/:title/:info", (req, res) => {
    const templateVars = {
      MAP_API: process.env.MAP_API,
      FILESTACK_API: process.env.FILESTACK_API,
      title: req.params.title,
      info: req.params.info
    }
    res.render("map", templateVars)
  })


  router.get("/markers", (req, res) => {
    knex.select('*', st.x('loc'), st.y('loc')).from('points')
    .then((results) => {
      res.json(results)
    })
  })

  router.post("/marker", (req, res) => {
    res.status(200)
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
    .then(() => {        // this will display POINT info from database
      knex.select('*', st.asText('loc')).from('points')
      .then((results) => {
        output = results
      })
      // .then(() => {
      //   console.log("points print: ", output)
      // })
    })
  })


  router.get("/mapbox", (req, res) => {
    const templateVars = {MAP_BOX_API_PRIVATE: process.env.MAP_BOX_API_PRIVATE,
      MAP_BOX_API_PUBLIC: process.env.MAP_BOX_API_PUBLIC}
    res.render("mapbox", templateVars)
  })


// this route adds map data to database when the form at api/users is submitted

  router.post("/mapInfo", (req, res) => {
    // console.log(req.body);
    knex('maps')
    .insert({
      title: req.body.title,
      info: req.body.info
    })
    .returning('id')
    .then((mapId) => {
      // add mapId value to cookie for this particular map
      req.session.map_id = Number(mapId)
      knex('usermaps')
      .insert({
        userid: req.session.user_id,
        mapid: Number(mapId)
      })
      .then(() => {
        console.log("new map cookie [user][map]: ", req.session.user_id, req.session.map_id)
      })
    })
    let title = req.body.title
    let info = req.body.info

    console.log("info request:", info)

    res.redirect(`view/${title}/${info}`)
  })

  router.post("/marker/delete", (req, res) => {
    // delete selected marker point
    const {latitude, longitude, loc} = req.body
    const {user_id, map_id} = req.session

    console.log("the loc from the marker:", loc)


    // delete selected marker point
    let coord = st.geomFromText(`Point(${Number(latitude)} ${Number(longitude)})`, 4326)
    console.log("these are the coordinates coded:", coord)
    console.log("that's the cookie user_id:", user_id)
    console.log("that's the cookies map_id:", map_id)

    knex('points')
    .where({
      createdby: user_id,
      // mapid: map_id,
      loc: coord
    })
    .del()
    .then(() => {     // simply prints out the updated list of points
      knex.select('*', st.asText('loc')).from('points')
      .then((results) => {
        // console.log(results)
      })
    })                // can comment out above `.then` section [from previous comment]
    .then(() => {
      res.status(200).send('Successfully Baleeted!')
    })
    .catch((err) => {
      console.log('Something done gone not worked right')
    })
    res.redirect("/api/maps")
  })


  return router;
}
