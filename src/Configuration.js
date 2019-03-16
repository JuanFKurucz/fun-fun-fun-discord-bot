"use strict";

const fs = require("fs");

let Config = null;

class Configuration {
  static get(){
    if(Config===null){
      Config = new Configuration();
    }
    return Config;
  }

  constructor() {
    this.config={};
    this.init();
  }

  init(){
    const configsFolder = "./src/config/",
          files = fs.readdirSync(configsFolder);
    files.forEach((filename) => {
      let name = filename.split(".")[0];
      this.config[name]=JSON.parse(fs.readFileSync(configsFolder+filename, "utf8"));
    });
  }
}


exports.config = function(){
  const configObject = Configuration.get();
  if(arguments.length===1){
    return configObject.config["global"][arguments[0]];
  } else {
    return configObject.config[arguments[0]][arguments[1]];
  }
};
