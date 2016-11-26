module.exports = {
  writeToPoints: function(data) {
    knex.insert({
      mapid: data.mapid,
      loc: st.geomFromText(`Point(${data.coordX} ${data.coordY})`, 4326),
      title: data.title,
      info: data.info,
      createdby: data.createdby,
      image: data.image
    }).into('points')
  },

  readFromPoints: function() {
    return knex.select('*', st.asText('loc')).from('points')
  }
}