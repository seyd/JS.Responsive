var customJson = require('./customBuild.json'),
    featureNumbersList = require('./featuresList.json'),
    customBuild = require('./customBuild.js'),
    cfg = '1';

featureNumbersList.forEach(function (feature) {
    if(customJson.indexOf(feature.file) != -1){
        cfg += '1';
    }else{
        cfg += '0';}
});

customBuild(cfg, 'custom', function () {
    console.log('Custom build DONE!');
});