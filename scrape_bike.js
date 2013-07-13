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

function colorToHex(color) {
  var red = color.R, green = color.G, blue = color.B;
  var rgb = blue | (green << 8) | (red << 16);
  return ('#' + ("000000" + rgb.toString(16)).substr(-6)).toUpperCase();
}

function randColor() {
  var max = 255, min = 0;
  var r = Math.floor(Math.random() * (max - min + 1)) + min;
  var g = Math.floor(Math.random() * (max - min + 1)) + min;
  var b =Math.floor(Math.random() * (max - min + 1)) + min;
  return colorToHex( {R: r, G: g, B: b});
}

function parse(json) {
  var geoJson = { type : "FeatureCollection", features: [] };
  var id = 0;
  for( var i in json.data ) {
    var row = json.data[i];

    var lat = parseFloat(row[14]), long = parseFloat(row[15]);
    var geoRow = { type: "Feature", id: id, properties:{}, geometry: { type: "Point", "coordinates" : [long, lat, 0.0] } };
    // geoRow.properties["marker-color"] = randColor();
    geoJson.features.push(geoRow);
    id++;
  }
  var out = JSON.stringify(geoJson);
  console.log(out);
}
