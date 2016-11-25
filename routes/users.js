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

// Requests for sign up

router.get("/signup", (req, res) => {
  res.render("signup")
});

router.post("/signup", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.render("signup", {errorMsg: "Please enter a username and password."});
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

// Requests for login

router.get("/login", (req, res) => {
  res.render("login")
});


router.post("/login", (req, res) => {

  knex('users')
  .select('email', 'password')
  .where('email', req.body.email)
  .then((info) => {
    console.log("info: ", info)
    if (info.length === 0) {
      res.render("login", {errorMsg: "Please enter a username and password."});
    } else if (bcrypt.compareSync(req.body.password, info[0].password)) {
      knex('users')
      .select('id')
      .where('email', req.body.email)
      .then( (arrayOfId) => {
        const userId = arrayOfId[0]
        console.log("arrayofId: ",arrayOfId);
        req.session.id = userId
        res.redirect("/");
        })
    } else {
      res.render("login", {errorMsg: "Did you forget your password?"});
    }
  });
});

// Request for logout

router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/api/users/login");
});


return router;
}
