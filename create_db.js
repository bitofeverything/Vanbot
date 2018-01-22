var sqlite3 = require('sqlite3').verbose();
var file = "vanbotDB";
var db = new sqlite3.Database(file);
 
db.serialize(function() {
db.run("CREATE TABLE counters(name TEXT, count INTEGER, guild TEXT, PRIMARY KEY(name, guild))");
db.run("CREATE TABLE commands (command TEXT, return TEXT, guild TEXT, PRIMARY KEY(command, guild));");
});
 
db.close();