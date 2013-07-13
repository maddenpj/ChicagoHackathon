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

function isOpen(start, end) {
  var newStart = new Date((new Date(start)).setYear(2013))
  var newEnd = new Date((new Date(end)).setYear(2013))
  var now = new Date()
  return (newStart < now && now < newEnd);
}

function getDateInt(openDay) {
  switch(openDay)
  {
    case "Sunday":
      return 0;
    case "Monday":
      return 1;
    case "Tuesday":
      return 2;
    case "Wednesday":
      return 3;
    case "Thursday":
      return 4;
    case "Friday":
      x="Today it's Friday";
      return 5;
    case "Saturday":
      return 6;
  }
}

function to24time(time) {
  var e = time.split(":");
  var i = parseInt(e[0]);
  if(e[1].search("PM") != -1) i += 12;
  return i;
}

function openNow(openDay, openTime, closeTime) {
  var now = new Date();
  // var now = new Date((new Date()).setHours(10))
  var bool = true;

  var dateInt = getDateInt(openDay);
  bool = bool && (dateInt == now.getDay());

  return bool && (now.getHours() > to24time(openTime)) && (now.getHours() < to24time(closeTime));
}

function parse(json) {
  var geoJson = { type : "FeatureCollection", features: [] };
  var id = 0;
  for( var i in json.data ) {
    var row = json.data[i];


    var start = Date.parse(row[13]);
    var end = Date.parse(row[14]);

    var openDay = row[10], openTime = row[11], closeTime = row[12];
    var openNowBool = openNow(openDay, openTime, closeTime);

    var color = openNowBool ? "#00B200" : "#B20000";
    var lat = parseFloat(row[18]), long = parseFloat(row[19]);
    var geoRow = { type: "Feature", id: id, properties: {"marker-color":color}, geometry: { type: "Point", "coordinates" : [long, lat, 0.0] } };

    geoRow.properties.name = row[8];
    geoRow.properties.url = row[15][0];
    if(!isOpen(start,end)) {
      geoRow.properties["marker-symbol"] = "cross";
    }

    geoJson.features.push(geoRow);
    id++;
  }
  var out = JSON.stringify(geoJson);
  console.log(out);
}
