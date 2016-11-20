var customBuild = require(__dirname + '/customBuild.js');

customBuild(false, 'default', function () {
    customBuild(false, 'full', function () { // temporary default is same as full
        console.log('BUILD IS DONE!');
    });
});