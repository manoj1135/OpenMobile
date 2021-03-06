console.log("Invoking database....");
const fs = require('fs');
const dbconf = require("./db-config");
const Sequelize = require("sequelize");
const dbDir = __dirname;
const modelDir = dbDir+"/models";
const AppConf = require("../AppConf");
const SeedData = require("./SeedData");

var sequelize = new Sequelize(
    dbconf.database,
    dbconf.user,
    dbconf.password,
    {
      host: dbconf.host,
      port: dbconf.port,
      dialect: 'mysql'
    }
  );

var db = {
    Sequelize: Sequelize,
    sequelize: sequelize
};

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  console.log("Invoking models...");
  var items = fs.readdirSync(modelDir);
  for (var i=0; i<items.length; i++) {
      let modelFile = items[i].split(".js")[0];
      db[modelFile] = require("./models/"+modelFile)(sequelize, Sequelize);
  }

  if(AppConf.isSeedUsers){
    SeedData.seedUser();
  }
module.exports = db;
