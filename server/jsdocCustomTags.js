exports.defineTags = function(dictionary) {
    dictionary.defineTag("custom-class", {
        mustHaveValue: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            console.log('dingdong', tag);
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
};
