"use strict";

const express = require('express')
const router  = express.Router()
const bodyParser  = require("body-parser")
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))


module.exports = (knex) => {
  const st = require('knex-postgis')(knex)      // ALLOWS FOR postGIS CALCULATIONS

  router.get("/favs", (req, res) => {
    console.log("success?")
    res.render("/")
  })


  router.get("/contributed", (req, res) => {

  })


  router.get("/all", (req, res) => {

  })
}