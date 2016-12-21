var fs = require('fs'),

    regexp = /<\?js if \(data\.defaultvalue\) \{\?>[^}]+<\?js } \?>/,
    match,
    newStr = '<?js if (data.customclass && data.customclass.length) {?> ' +
                '<dt class="tag-default method-doc-label method-doc-details-label">Classes applied to &lt;HTML&gt;:</dt> ' +
                '<dd class="tag-default"> ' +
                    '<ul class="dummy"> ' +
                        '<?js data.customclass.forEach(function(c) { ?> ' +
                            '<li><?js= c.name ?> - <?js= c.description ?><?js if (c.demo) {?>(<a href="<?js= c.demo ?>">DEMO</a>)<?js } ?></li>' +
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