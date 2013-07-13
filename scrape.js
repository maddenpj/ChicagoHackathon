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
  console.log(json.data);
}
