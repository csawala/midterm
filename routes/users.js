"use strict";

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

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
   if (req.body.email === "" || req.body.password === "") {
     res.status(400)
     res.send("Please enter an email and password.");
  } else {
    knex('users')
      .insert({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    }, 'id')
     .then((arrayOfId) => {
       const id = arrayOfId[0]
       req.sessions(id)
       res.redirect("/");
     })
     .catch(err => {
       res.state(400)
     })
   }
 });


 router.get("/login", (req, res) => {
   res.render("login")
 });

 return router;
}
