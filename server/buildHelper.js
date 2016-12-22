var customBuild = require(__dirname + '/customBuild.js');

customBuild('6257', 'default', function () {
    customBuild(false, 'full', function () {
        console.log('BUILD IS DONE!');
    });
});