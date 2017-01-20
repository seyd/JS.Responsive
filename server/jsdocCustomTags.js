var fs = require('fs');
var srcFolder = __dirname + '/../src';
var files = fs.readdirSync(srcFolder);
var teasersProcessed = [];
var prettyProcessed = [];
var membersProcessed = [];
var membersModulesProcessed = [];
var flData = [];

var methodReg = /^\$C\./;
var moduleReg = /^module:/;

exports.defineTags = function(dictionary) {
    dictionary.defineTag("custom-class", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            // console.log('dingdong', tag);
            if(!doclet.customclass)
                doclet.customclass = [];

            var demoAndUrl = /(DEMO: )([-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?)/,
                match = tag.text.match(demoAndUrl);
            if(match){
                tag.value.demo = match[2];
                tag.value.description = tag.value.description.replace(demoAndUrl, '');
            }

            doclet.customclass.push(tag.value);
        }
    });
    dictionary.defineTag("teaser", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: false,
        onTagged: function(doclet, tag) {
            // console.log('dingdong', tag, doclet);
            doclet.teaser = tag.value;

            if(teasersProcessed.indexOf(doclet.name) > -1) // in many files this function is called twice for same tag
                return;
            var index = teasersProcessed.push(doclet.name)-1;

            var data = flData[index];
            if(!data){
                flData[index] = {};
                data = flData[index];
            }

            data.file = camelCaseToDash(doclet.name);
            data.description = doclet.description;
            data.teaser = tag.value;

            if(isReady())
                writeFeaturesList();
        }
    });
    dictionary.defineTag("pretty-name", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: false,
        onTagged: function(doclet, tag) {
            // console.log('dingdong', tag, doclet);
            doclet.prettyName = tag.value;

            if(prettyProcessed.indexOf(doclet.name) > -1) // in many files this function is called twice for same tag
                return;
            var index = prettyProcessed.push(doclet.name)-1;

            var data = flData[index];
            if(!data){
                flData[index] = {};
                data = flData[index];
            }

            data.prettyName = tag.value;

            if(isReady())
                writeFeaturesList();
        }
    });
    dictionary.defineTag("memberof", {
        mustHaveValue: true,
        onTagged: function(doclet, tag) {
            if (tag.originalTitle === 'memberof!') {
                doclet.forceMemberof = true;
            }
            if (tag.value && tag.value !== '<global>') {
                doclet.setMemberof(tag.value);
            }

            var name = doclet.meta && doclet.meta.code && doclet.meta.code.name;

            if(!name || typeof name != 'string' || !name.match(methodReg) || !tag.value.match(moduleReg) || doclet.undocumented || membersProcessed.indexOf(name) > -1) // in many files this function is called twice for same tag
                return;
            membersProcessed.push(name);

            var index = membersModulesProcessed.indexOf(tag.value);
            if(index == -1)
                index = membersModulesProcessed.push(tag.value)-1;

            var data = flData[index];
            if(!data){
                flData[index] = {};
                data = flData[index];
            }

            if(!data.methods)
                data.methods = [];

            data.methods.push(name.replace(methodReg, ''));

            if(isReady())
                writeFeaturesList();
        },
        synonyms: ['memberof!']
    });
};

function isReady() {
    return membersModulesProcessed.length+1 == files.length && teasersProcessed.length+1 == files.length; // +1 because of core file
}

function writeFeaturesList() {
    // console.log('write fl', flData);
    if(flData.length)
        fs.writeFile(__dirname + '/featuresList.json', JSON.stringify(flData), null, function (err) {
            if(err) console.log(err);
            console.log(__dirname + '/featuresList.json updated');
        });
}

function camelCaseToDash( myStr ) {
    return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}
