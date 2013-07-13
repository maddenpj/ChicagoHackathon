var https = require('https')


json = {}
https.get("https://data.cityofchicago.org/api/views/cbyb-69xx/rows.json?accessType=DOWNLOAD", function(res){
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

    var lat = parseFloat(row[14]), long = parseFloat(row[15]);
    var geoRow = { type: "Feature", id: id, geometry: { type: "Point", "coordinates" : [long, lat, 0.0] } };

    geoJson.features.push(geoRow);
    id++;
  }
  var out = JSON.stringify(geoJson);
  console.log(out);
}
