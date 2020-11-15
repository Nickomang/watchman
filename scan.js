const path = require('path');
const fs = require('fs');
var anitomy = require('anitomy-js')

//////////////
// ANITOMY
//////////////
// Scans a given directory, parses files using Anitomy, and adds the info to the given JSON
function parseDirs(json, directoryPath) {
    var files = fs.readdirSync(directoryPath);

    var parse = anitomy.parseSync(files);
    // console.log(p);
    var showname = parse[0].anime_title;
    var data = {
        "episodes": []
    };
    if (json["shows"]) {
        data["episodes"] = parse;
        if (showname) {
            json["shows"][showname] = data;
        }
    }
    return json;
};

module.exports = {parseDirs};