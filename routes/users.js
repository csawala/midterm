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
    res.send("Please enter an email and password.")
 } else {
   knex('users')
     .insert({
       email: req.body.email,
       password: bcrypt.hashSync(req.body.password, 10),
   }, 'id')
    .then((arrayOfId) => {
      const id = arrayOfId[0]
      req.session.user_id = id
      res.redirect("/");
    })
    .catch(err => {
      res.status(400)
    })
  }
});


router.get("/login", (req, res) => {
  res.render("login")
});


router.post("/login", (req, res) => {

  knex('users')
  .select('email', 'password')
  .where('email', req.body.email)
  .then((info) => {
    if (info.length === 0) {
    res.status(400)
    res.send("Please enter an email.");
    res.redirect("/");
    } else if (bcrypt.compareSync(req.body.password, info[0].password)) {
    knex('users')
    .select('id')
    .where('email', req.body.email)
    .then( (arrayOfId) => {
      const userId = arrayOfId[0]
      console.log(arrayOfId[0]);
      req.session.id = userId
      res.redirect("/");
      })
    } else {
      res.status(400)
      res.send("Did you forget your password?")
      res.redirect("/");
    }
  });
});

return router;
}
