var fs = require('fs'),

    regexp = /<\?js if \(data\.defaultvalue\) \{\?>[^}]+<\?js } \?>/,
    match,
    newStr = '<?js if (data.customclass && data.customclass.length) {?> ' +
                '<dt class="tag-default method-doc-label method-doc-details-label">Classes applied to &lt;HTML&gt;:</dt> ' +
                '<dd class="tag-default"> ' +
                    '<ul class="dummy"> ' +
                        '<?js data.customclass.forEach(function(c) { ?> ' +
                            '<li><?js= c.name ?><?js if (c.description) {?> - <?js= c.description ?><?js } ?><?js if (c.demo) {?>(<a href="<?js= c.demo ?>">DEMO</a>)<?js } ?></li>' +
                        '<?js }); ?> ' +
                    '</ul> ' +
                '</dd> ' +
            '<?js } ?>' +
            '<?js if (data.fires && data.fires.length) {?> ' +
                '<dt class="tag-default method-doc-label method-doc-details-label">Events:</dt> ' +
                '<dd class="tag-default"> ' +
                    '<ul class="dummy"> ' +
                        '<?js data.fires.forEach(function(f) { ?> ' +
                            '<li><?js= f.replace(/^event:/,"") ?></li>' +
                        '<?js }); ?> ' +
                    '</ul> ' +
                '</dd> ' +
            '<?js } ?>';

fs.readFile(__dirname + '/../node_modules/ink-docstrap/template/tmpl/details.tmpl', 'utf-8', function(err, contents) {
    if (err) console.error(err);

    if(contents.match(/data\.customclass && data\.customclass\.length/))
        return; // already fixed

    match = contents.match(regexp);

    if(!match)
        return;

    contents = contents.replace(match[0], match[0] + newStr);

    fs.writeFile(__dirname + '/../node_modules/ink-docstrap/template/tmpl/details.tmpl', contents, function(err){
        "use strict";
        if(err) console.error(err);

        console.log('file fix done: ', './node_modules/ink-docstrap/template/tmpl/details.tmpl');
    });
});

/**
 * Created by luckylooke on 20/11/16.
 * temporary fixing the jsdoc webpack plugin, until the contributed fix will be published on npm
 * More info: https://github.com/tfiwm/jsdoc-webpack-plugin/commit/d12eadd7c3e24d1a0bb7b55e1ee08c6369ae8f2d#commitcomment-19893998
 */

var filePath = __dirname + '/../node_modules/jsdoc-webpack-plugin/index.js';

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