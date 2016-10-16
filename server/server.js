var express = require("express"),
    app = express(),
    http = require("http"),
    path = require('path'),
    fs = require('fs'),
    server = http.Server(app),
    customBuild = require(__dirname + '/customBuild');

/* ************************************************************************************************** */
/* SERVER INIT */
/* ************************************************************************************************** */

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3003);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "0.0.0.0");

server.listen(app.get('port') ,app.get('ip'), function () {
    console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});

app.use(express.static(path.resolve( __dirname + '/../demo')));

/* routing */

// /download?cfg=1234
app.get('/download', function (req, res) {
    var cfg = req.query.cfg && (+req.query.cfg).toString(2); // convert decimal string to binary string
    console.log('cfg: ', cfg);
    if(cfg)
        customBuild(cfg, 'custom', function callback() {
            res.sendFile(path.resolve(__dirname + '/../dist/JS.Responsive.custom.js'));
        });
});
app.get('/dist/*', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../' + req.url));
});
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../demo/demo.html'));
});

fs.watch(path.resolve(__dirname + '/../src/'), function(){
    "use strict";
    buildFullAndDefault();
});

buildFullAndDefault();

// DECLARATIONS:

function buildFullAndDefault() {
    customBuild(false, 'full', function () {
        customBuild(false, 'default'); // temporary default is same as full
    });
}






