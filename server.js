var express               = require('express'),
    path                  = require('path'),
    app                   = express();

app.use( express.static( path.join(__dirname,'/app') ) );

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});