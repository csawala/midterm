"use strict";

const express = require('express');
const router  = express.Router();


const knex = (knex) => {

 router.get("/", (req, res) => {
   knex
     .select("*")
     .from("users")
     .then((results) => {
       res.json(results);
   });
 });

 return router;
}

const signup = (knex) => {

router.get("/signup", (req, res) => {
  res.render("signup")
})
return router;
}




const postSignup = (knex) => {

  router.post("/signup", (req, res) => {
    knex('users')
      .insert({
        username: req.body.email,
        password: req.body.password
      })
      .then(function() {
        return {inserted: true}
      })
      // .catch(() => {
      //     // need to add promise that username or password can't be empty
      // })
      res.redirect("/");
    })

    return router
};



const login = (knex) => {

router.get("/login", (req, res) => {
  res.render("login")
})

return router;
}



module.exports = {
 knex: knex,
 signup: signup,
 login: login,
 postSignup: postSignup
}
