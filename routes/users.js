"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
      });
  });

  router.get("/signup", (req, res) => {
    res.render("signup")
  });

  router.post("/signup", (req, res) => {
    knex('users')
      .insert({
        username: req.body.email,
        password: req.body.password
      })
      .then(function() {
        // return {inserted: true}
        res.redirect("/");
      })
      // .catch(() => {
      //     // need to add promise that username or password can't be empty
      // })
  });

  router.get("/login", (req, res) => {
    res.render("login")
  });


  return router;

}
