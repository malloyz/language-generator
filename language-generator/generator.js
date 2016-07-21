var fs = require('fs');
var path = require('path');
var xlsx = require('node-xlsx');
var util = require("../util/Util.js");

var basePath = __dirname;
var fileStorePath = process.argv[2];
var languageExcelPath = process.argv[3];
var debugArg = process.argv[4];

var languageRootPath = path.join(fileStorePath, "language/");

var generator = function () {
    var sheetsData = xlsx.parse(languageExcelPath);

    if (0 == sheetsData.length) {
        console.log("excel have no sheet");
        return;
    }

    var languageData = sheetsData[0].data;
    if (languageData.length < 3) {
        console.log("row data error");
        return;
    }

    if (languageData[0].length < 3) {
        console.log("col data error");
        return;
    }

    var contents = [];
    var secondRow = languageData[1];
    contents[0] = {name: secondRow[0], data: {}};
    for (var col = 2, len = secondRow.length; col < len; col++) {
        contents[col] = {name: secondRow[col], data: {}};
    }

    if (debugArg == 'debug') {
        console.log(languageData);
    }

    for (var row = 2, rowLen = languageData.length; row < rowLen; row++) {
        var rowData = languageData[row];
        var key = rowData[0];
        contents[0].data[key] = key;
        for (var col = 2, colLen = rowData.length; col < colLen; col++) {
            contents[col].data[key] = rowData[col];
        }
    }

    try {
        for (var i in contents) {
            var name = contents[i].name;
            var data = contents[i].data;
            var filePath = path.join(languageRootPath, name + ".js");
            fs.writeFile(filePath, 'var ' + name + ' = ' + JSON.stringify(data, null, 4) + ';');
            console.log(filePath + "生成成功");
        }
    }
    catch (e) {
        console.log('Write effect file failed');
    }
};

if (module == require.main) {
    util.deleteFolderRecursive(languageRootPath);
    util.makeDir(languageRootPath);
    generator();
};


