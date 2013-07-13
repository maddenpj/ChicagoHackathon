var https = require('https')


var magic = 7;
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


function colorToHex(color) {
  var red = color.R, green = color.G, blue = color.B;
  var rgb = blue | (green << 8) | (red << 16);
  return ('#' + ("000000" + rgb.toString(16)).substr(-6)).toUpperCase();
}


var Red = { R:255,G: 0, B:0 }
var Green = { R: 0, G:255, B: 0}
function gradientRG(p) {
 var r = Green.R*p + Red.R*(1-p);
 var g = Green.G*p + Red.G*(1-p);
 var b = Green.B*p + Red.B*(1-p);
 return colorToHex({R: r, G: g, B: b});
}

function parse(json) {
  var geoJson = { type : "FeatureCollection", features: [] };
  var id = 0;
  for( var i in json.data ) {
    var row = json.data[i];

    var pcnt = parseFloat(row[18])/parseFloat(row[17]);
    var color = gradientRG(pcnt)
    var pString = (pcnt*100.0).toFixed(1) + "%";
    var geoRow = { type: "Feature", id: id, properties: { "Vegetated Percentage": pString, "marker-symbol": "garden", "marker-color":color}, geometry: { type: "Point", "coordinates" : [parseFloat(row[21]), parseFloat(row[20]), 0.0] } };
    geoJson.features.push(geoRow);
    id++;
  }
  var out = JSON.stringify(geoJson);
  console.log(out);
}
