require('dotenv').config();

const ENV         = process.env.ENV || "development";

const knexConfig  = require("../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const st          = require('knex-postgis')(knex)


module.exports = {
  writeToPoints: function(data) {
    knex.insert({
      mapid: 4,
      loc: st.geomFromText(`Point(${Number(data.lat)} ${Number(data.lng)})`, 4326),
      title: data.title,
      info: data.description,
      createdby: 4,
      image: ''
    }).into('points')
    .then(() => {
      knex.select('*', st.asText('loc')).from('points')
      .then((output) => {
        console.log("writeToPoints: ", output)
        return output
      })
    })
  },

  readFromPoints: function() {
    knex.select('*', st.asText('loc')).from('points')
    .then((data) => {
      return data
    })
  },

  readFromTable: function(tableName) {
    let output = []
    knex.select('*').from(tableName)
    .then((data) => {
      console.log("data: ", data)
      output = data
      data.forEach(function(value){
        console.log("value: ", value)
      })
      console.log("output w/in data: ", output)
    }).then(() => {
      console.log("output after: ", output)
      return output
    })
  }
}