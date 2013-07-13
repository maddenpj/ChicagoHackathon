var https = require('https')


json = {}
https.get("https://data.cityofchicago.org/api/views/q3z3-udcz/rows.json?accessType=DOWNLOAD", function(res){
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

    var geoRow = { type: "Feature", id: id, properties: {}, geometry: { type: "Point", "coordinates" : [parseFloat(row[21]), parseFloat(row[20])] } };
    geoJson.features.push(geoRow);
    id++;
  }
  var out = JSON.stringify(geoJson);
  console.log(out);
}
