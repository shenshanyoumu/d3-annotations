import dsv from "./dsv";

// 因此CSV只是dsv的实例对象而已
var csv = dsv(",");

export var csvParse = csv.parse;
export var csvParseRows = csv.parseRows;
export var csvFormat = csv.format;
export var csvFormatRows = csv.formatRows;
