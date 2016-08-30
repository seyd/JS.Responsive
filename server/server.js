var purgeCache = require("./../utils/purgeCache"),
    express = require("express"),
    app = express(),
    http = require("http"),
    path = require('path'),
    fs = require('fs'),
    server = http.Server(app),
    webpack = require("webpack"),
    webpackConfig = require("./../webpack.config"),
    optionalFilesList = [
        '/../src/isMobile.js'
    ];

purgeCache("./../webpack.config");

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

    var selectedFilesList = [],
        skippedFilesList = [];

    if(cfg)
        optionalFilesList.forEach(function (feature, i) {
            if(parseInt(cfg[i])) // get 0 or 1 from binary string
                selectedFilesList.push(feature);
            else
                skippedFilesList.push(feature);
        });
    else
        selectedFilesList = optionalFilesList.slice(0); // TODO: Replace by defaultList

    fs.readFile( __dirname + '/../src/JS.Responsive.source.js', 'utf8', function (err,JSRSource) {
        if (err) return console.log(err);

        if(selectedFilesList.length)
            fs_readFiles(selectedFilesList, function (err, data) {
                if (err) return console.log(err);

                var concat = '';
                data.forEach(function (content) {
                    concat += content;
                });

                writeResult(concat);
            });
        else
            writeResult('// TODO: missing features console message');

        function writeResult(concat) {
            var result = JSRSource.replace(/\/\* Optional files content goes here! \*\//g, concat);

            fs.writeFile( __dirname + '/../tmp/JS.Responsive.entry.js', result, 'utf8', function (err) {
                if (err) return console.log(err);

                var compiler = webpack(webpackConfig);
                compiler.run(function (err, stats) {
                    if(err) return console.log(err);

                    // console.log("webpack stats", stats);
                    res.sendFile(path.resolve(__dirname + '/../dist/JS.Responsive.js'));
                });
            });
        }
    });
});
app.get('/dist/*', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../' + req.url));
});
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../demo/demo.html'));
});

/**
 * Abstract helper to asyncly read a bulk of files
 * Note that `cb` will receive an array of errors for each file as an array of files data
 * Keys in resulting arrays will be the same as in `paths`
 *
 * @param {Array} paths - file paths array
 * @param {Function} cb
 *   @param {Array} errors - a list of file reading error
 *   @param {Array} data - a list of file content data
 */
function fs_readFiles (paths, cb) {
    var result = [], errors = [], l = paths.length;
    paths.forEach(function (path, k) {

        fs.readFile( __dirname + path, 'utf8', function (err, data) {
            // decrease waiting files
            --l;
            // just skip non-npm packages and decrease valid files count
            err && (errors[k] = err);
            !err && (result[k] = data);
            // invoke cb if all read
            !l && cb (errors.length? errors : undefined, result);
        });

    });
}





