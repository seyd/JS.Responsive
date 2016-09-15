var fs = require('fs'),
    webpack = require("webpack"),
    webpackConfig = require("./../webpack.config.js"),
    featuresList = require('./featuresList.json')
        .map(function processList(feature) { // processing raw list
        return {
            file:'/../src/' + feature.file + '.js',
            methods: Array.isArray(feature.methods) ? feature.methods : [feature.methods]
        }
    }),
    running = {};

module.exports = function(cfg, buildName, callback){
    "use strict";

    if(running[buildName]) // do start same build twice in a time
        return;
    else
        running[buildName] = true;

    var selectedFilesList = [],
        skippedFilesList = [];

    if(cfg){
        cfg = cfg.substr(1); // first place is always 1 as protection of loosing leading zeros

        featuresList.forEach(function (feature, i) {
            if(parseInt(cfg[i])) // get 0 or 1 from binary string
                selectedFilesList.push(feature.file);
            else
                skippedFilesList.push(feature.methods);
        });
    }else
        selectedFilesList = featuresList.map(function processList(feature) { // processing raw list
            return feature.file;
        });

    fs.readFile( __dirname + '/../src/JS.Responsive.source.js', 'utf8', function (err,JSRSource) {
        if (err) return console.log(err);

        var missing = skippedFilesList.reduce(function (result, methods) {
            return result + methods.reduce(function (methodsResult, method) {
                    return methodsResult + '\r\n $C.' + method + ' = missingMethod("' + method + '");';
                }, '');
        }, '');

        if(selectedFilesList.length)
            fs_readFiles(selectedFilesList, function (err, data) {
                if (err) return console.log(err);

                var concat = data.join('\r\n'); // new line separator
                concat += missing;

                writeResult(concat);
            });
        else
            writeResult(missing);

        function writeResult(concat) {
            var result = JSRSource.replace(/\/\* Optional files content goes here! \*\//g, concat),
                entryName = __dirname + '/../tmp/JS.Responsive.entry' + capitalizeFirstLetter(buildName) + '.js',
                outputName = 'JS.Responsive' + (buildName === 'default' ? '' : '.' + buildName);

            fs.writeFile( entryName, result, 'utf8', function (err) {
                if (err) return console.log(err);

                console.log('Build start: ', buildName);

                var entry = {};
                entry[outputName] = entryName;
                entry[outputName + '.min'] = entryName;

                webpackConfig.entry = entry;
                webpackConfig.output.filename = '[name].js';

                var compiler = webpack(webpackConfig);
                compiler.run(function (err, stats) {
                    if(err) return console.log(err);

                    console.log('Build end: ', buildName);
                    // console.log("webpack stats", stats);
                    if(callback)
                        callback();

                    running[buildName] = false;
                });
            });
        }
    });
};

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

        console.log('reading: ', path);

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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}