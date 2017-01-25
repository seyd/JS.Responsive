var fs = require('fs'),
    webpack = require("webpack"),
    JsDocPlugin = require('jsdoc-webpack-plugin'),
    webpackConfig = require(__dirname + '/../webpack.config.js'),
    defaultCfg = require(__dirname + '/defaultCfg.js'),
    featuresList = require(__dirname + '/featuresList.json')
        .map(function processList(feature) { // processing raw list
            return {
                file:'/../src/' + feature.file + '.js',
                methods: Array.isArray(feature.methods) ? feature.methods : [feature.methods]
            }
        }),
    running = {};

if (!fs.existsSync(__dirname + '/../tmp')){
    fs.mkdirSync(__dirname + '/../tmp');
}

module.exports = function(cfg, buildName, callback, version){
    "use strict";

    console.log('CUSTOM BUILD INPUT w/o cb: ', cfg, buildName, version);

    if(running[buildName]) // do start same build twice in a time
        return;
    else
        running[buildName] = true;

    var selectedFilesList = [],
        skippedFilesList = [];

    cfg = buildName == 'default' ? defaultCfg : (cfg || '');

    if(cfg){
        var bcfg = (+cfg).toString(2); // convert decimal string to binary string
        bcfg = bcfg.substr(1); // first place is always 1 as protection of loosing leading zeros

        featuresList.forEach(function (feature, i) {
            if(parseInt(bcfg[i])) // get 0 or 1 from binary string
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
                outputName = 'JS.Responsive' + (buildName !== 'default' ? '.' + buildName : '');

            fs.writeFile( entryName, result, 'utf8', function (err) {
                if (err) return console.log(err);

                console.log('Build start: ', buildName, version || '');

                var entry = {};
                entry[outputName] = entryName;
                entry[outputName + '.min'] = entryName;

                webpackConfig.entry = entry;
                // webpackConfig.debug = true;
                webpackConfig.context = __dirname;

                var path = '';

                if(version){
                    path += '/tmp/' + version;
                    if(!fs.existsSync(__dirname + '/..' + path)){
                        fs.mkdirSync(__dirname + '/..' + path);
                    }
                }else{
                    path += '/dist';
                }

                if(buildName !== 'default'){
                    path += '/' + buildName + cfg;
                    if(!fs.existsSync(__dirname + '/..' + path)){
                        fs.mkdirSync(__dirname + '/..' + path);
                    }
                }

                webpackConfig.output.path = __dirname + '/..' + path;

                console.log('webpackConfig.output.filename', webpackConfig.output.filename, outputName);
                console.log('webpackConfig.output.path', webpackConfig.output.path);

                if(buildName === 'full' && !version) // build docs if full is rebuilded
                    webpackConfig.plugins.push(new JsDocPlugin({
                        conf: __dirname + '/../jsdoc.json'
                    }));

                var compiler = webpack(webpackConfig);
                compiler.run(function (err, stats) {
                    if(err) return console.log(err);

                    if(buildName === 'full' && !version) // build docs if full latest is rebuilded
                        webpackConfig.plugins.pop(); // pop JsDocPlugin

                    if(version){
                        // create zip file for whole folder
                        zipFolder(version, buildName, cfg, callback);
                    }

                    console.log('Build end: ', buildName + cfg);
                    // console.log("webpack stats", stats);
                    if(!version && callback)
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

function zipFolder(version, name, cfg, callback) {
    if(name === 'default'){
        name = '';
        cfg = '';
    }

    var dotName = name ? '.' + name : '';
    var fs = require('fs');
    var path = __dirname + '/../tmp/' + version + (name ? '/' + name : '') + cfg;
    var output = fs.createWriteStream(path + '/JS.Responsive' + dotName + cfg + '.zip');
    var archiver =  require('archiver');
    var zipArchive = archiver('zip');

    zipArchive.on('error', function(err) {
        throw err;
    });

    output.on('close', function(err) {
        if (err)
            throw err;

        console.log('ZIP done:', 'JS.Responsive' + dotName + cfg + '.zip');

        if(callback)
            callback();
    });

    zipArchive.pipe(output);
    zipArchive.glob('*.js', {
        cwd: path
    });
    zipArchive.glob('*.map', {
        cwd: path
    });
    zipArchive.finalize();
}