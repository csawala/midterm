'use strict';
const knex = require('knex')({
  dialect: 'postgres'
})

const st = require('knex-postgis')(knex)



exports.seed = function(knex, Promise) {
  // ============== USERS TABLE SEEDING ==============
  return knex('users').del()
    .then(function () {
      return knex
      .insert({
        email: 'test@test.com',
        password: 'test'
      })
      .into('users')
      .returning('id')          // this will bring the base user ID to use as 'userIds'
      .then(function(userIds) {

        // ============== MAPS TABLE SEEDING ==============
        return knex('maps').del()
          .then(function () {
            return knex
            .insert({
              title: 'Test Map',
              info: 'This is the greatest test map data ever!'
            })
            .into('maps')
            .returning('id')          // this will bring the base map ID to use as 'mapIds'
            .then(function(mapIds) {

              // ============== POINTS TABLE SEEDING ==============
              return knex('points').del()
                .then(function () {
                  return knex
                  .insert({
                    mapid: Number(mapIds),
                    loc: st.geomFromText('Point(43.644643 -79.394999)', 4326),
                    title: 'Lighthouse Labs',
                    info: 'Bootcamp Madness - guaranteed in 9 weeks or less!',
                    createdby: Number(userIds),
                    image: 'http://www.lighthouselabs.ca/static-assets/lighthouse-labs.png'
                  })
                  .into('points')
                  .then(function() {

                  // ============== USERMAPS TABLE SEEDING ==============
                    return knex('usermaps').del()
                    .then(function () {
                      return Promise.all([
                        knex('usermaps').insert({
                          userid: Number(userIds),
                          mapid: Number(mapIds),
                          fav: 'false'
                        }),
                      ])
                    })
                  })
                })
            })
          })
      })
    })
}