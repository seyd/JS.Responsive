/**
 * Created by luckylooke on 20/11/16.
 * temporary fixing the jsdoc webpack plugin, until the contributed fix will be published on npm
 * More info: https://github.com/tfiwm/jsdoc-webpack-plugin/commit/d12eadd7c3e24d1a0bb7b55e1ee08c6369ae8f2d#commitcomment-19893998
 */

"use strict";
var fs = require('fs');
var filePath = __dirname + '/node_modules/jsdoc-webpack-plugin/index.js';

fs.readFile(filePath, 'utf-8', function(err, contents){
    if(err)
        console.log('error', err);
    if(!contents)
        return;

    if(!contents.match("jsdoc = spawn('./node_modules/.bin/jsdoc', files.concat('-c', jsDocConfTmp));"))
        console.log('fix may be not needed anymore, please let me know to luckylooke@gmail.com');
    else
        contents = contents.replace("jsdoc = spawn('./node_modules/.bin/jsdoc', files.concat('-c', jsDocConfTmp));",
                                "jsdoc = spawn(__dirname + '/node_modules/.bin/jsdoc', files.concat('-c', jsDocConfTmp));");

    fs.writeFile(filePath, contents, function(err){
        if(err) console.error(err);
        console.log('temporary fixing the jsdoc webpack plugin done: ', filePath);
    });
});