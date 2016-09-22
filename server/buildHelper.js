var customBuild = require('./customBuild.js');

customBuild(false, 'full', function () {
    customBuild(false, 'default', function () { // temporary default is same as full
        console.log('BUILD IS DONE!');
    });
});