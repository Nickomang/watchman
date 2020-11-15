const scan = require('./scan');
const fs = require('fs');


//////////////
// PARAMETERS
//////////////
// Should set these from config file eventually
var __jsonPath = './data.json'
var __dirsPath = './dirs.json'
var __playerPath = '/usr/local/bin/mpv'

function writeDirs(dirsPath, dirs) {
    fs.writeFileSync(dirsPath, JSON.stringify(dirs));
    console.log("Directories written");
}




//////////////
// DIRECTORY
//////////////

// reads and returns the parsed list of directories
function readDirs(dirsPath) {
    data = fs.readFileSync(dirsPath);
    data = JSON.parse(data);
    if (data['directories']) {
        dirs = data;
    }
    return dirs;
}

// adds a directory to the list
function addDir(dirsPath, dir) {
    // If no file, create one
    if (!fs.existsSync(dirsPath)) {
        data = {
            "directories": {}
        }
        fs.writeFileSync(dirsPath, JSON.stringify(data)); 
        console.log("File created");
    }
    dirs = readDirs(dirsPath);
    console.log("Adding directory " + dir + "...");
    dirs['directories'][dir] = 1;
    writeDirs(dirsPath, dirs);
}

// Remove a directory
function removeDir(dirsPath, dir) {
    console.log("Removing directory " + dir + "...");
    try {
        dirs = readDirs(dirsPath);
    } catch {
        console.log("No directories found, try adding some");
        return;
    }
    try {
        delete dirs["directories"][dir];
        console.log("Directory removed");
    } catch {
        console.log("Directory not found");
    }
    writeDirs(dirsPath, dirs);
}

//////////////
// DATA
//////////////

// Uses the list from dirs.json to recreate data.json
function scanFromDirs(jsonPath, dirsPath) {
    console.log("dirspath: " + dirsPath);
    dirs = readDirs(dirsPath);
    json = readJson(jsonPath);
    console.log(dirs);
    for (dir in dirs["directories"]) {
        if (dir) {
            rescan(jsonPath, json, dir);
        }
    }
}

// reads in the json file
function readJson(jsonPath) {
    // if no file, create one
    if (!fs.existsSync(jsonPath)) {
        data = {
            "shows": {}
        }
        fs.writeFileSync(jsonPath, JSON.stringify(data)); 
        console.log("created file");
    } else {
    // otherwise load data from file
        console.log("reading data file " + jsonPath + "..." );
        data = fs.readFileSync(jsonPath);
    }
    try {
        j = JSON.parse(data);
        console.log("file read");
        if (j)
        return j;
    } catch {
        return {};
    }
}

// writes out to the json file
function writeJson(jsonPath, j) {
    if (j) {
        console.log("writing json...");
        fs.writeFileSync(jsonPath, JSON.stringify(j));
        console.log("json written")
    }
}

// Rescan
function rescan(jsonPath, json, dir) {
    if (json["shows"]) {
        scan.parseDirs(json, dir);
        writeJson(jsonPath, json);
    }
}



//////////////
// CLI
//////////////
function main() {
    if (process.argv.length <= 2) {
        console.log("Usage: " + __filename + " <directory add/directory remove/rescan> <path>");
        process.exit(-1);
    }
    console.log(process.argv[2]);
    switch (process.argv[2]) {
        case "directory": {
            if (process.argv[3] == "add") {
                addDir(__dirsPath, process.argv[4]);
            } else if (process.argv[3] == "remove") {
                removeDir(__dirsPath, process.argv[4]);
            } else {
                console.log("Usage: " + __filename + " directory <add/remove> <path>");
            }
            process.exit(-1);
        }
        case "rescan": {
            scanFromDirs(__jsonPath, __dirsPath);
        }
    }
}

main();