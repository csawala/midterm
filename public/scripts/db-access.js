require('dotenv').config();

const ENV         = process.env.ENV || "development";

const knexConfig  = require("../../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const st          = require('knex-postgis')(knex)


module.exports = {
  writeToPoints: function(data) {
    knex.insert({
      mapid: data.mapid,
      loc: st.geomFromText(`Point(${data.coordX} ${data.coordY})`, 4326),
      title: data.title,
      info: data.info,
      createdby: data.createdby,
      image: data.image
    }).into('points').then(() => {
      knex.select('*', st.asText('loc')).from('points')
      .then((output) => {
        console.log(output)
      })
    })
  },

  readFromPoints: function() {
    knex.select('*', st.asText('loc')).from('points')
    .then((data) => {
      console.log(data)
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