var https = require('https')


json = {}
https.get("https://data.cityofchicago.org/api/views/hu6v-hsqb/rows.json?accessType=DOWNLOAD", function(res){
  var data = '';

  res.on('data', function (chunk){
    data += chunk;
  });

  res.on('end',function(){
    var json = JSON.parse(data);
    parse(json);

  })

});


function parse(json) {
  var geoJson = { type : "FeatureCollection", features: [] };
  var id = 0;
  for( var i in json.data ) {
    var row = json.data[i];

    var color = "#00B200"
    var lat = parseFloat(row[18]), long = parseFloat(row[19]);
    var geoRow = { type: "Feature", id: id, properties: {"marker-color":color}, geometry: { type: "Point", "coordinates" : [long, lat, 0.0] } };

    geoRow.properties.name = row[8];
    geoRow.properties.url = row[15][0];

    geoJson.features.push(geoRow);
    id++;
  }
  var out = JSON.stringify(geoJson);
  console.log(out);
}
