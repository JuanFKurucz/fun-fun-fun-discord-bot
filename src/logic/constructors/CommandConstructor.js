"use strict";

const Constructor = require("../Constructor.js"),
      fs = require("fs");

module.exports = class CommandConstructor extends Constructor {
  constructor(botprefix){
    const commandsFolder = "./src/logic/commands/",
          files = fs.readdirSync(commandsFolder),
          elements = {},
          namesCheck = {};
    let i=0;

    files.forEach(function(filename) {
      if(filename.toLowerCase().indexOf("abstract")===-1){
        let name = filename.substring(0,filename.lastIndexOf("Command")).toLowerCase();
        if(namesCheck.hasOwnProperty(name) === false){
          elements[i]={
            name,
            "constructor":require("../commands/"+filename)
          };
          namesCheck[name]=true;
          i++;
        } else {
          console.error(name+" already exists as a command. DUPLICATED COMMAND NAME",0);
        }
      }
    });

    super("Command",elements);
    this.botPrefix=botprefix;
  }

  initCommands(){
    let commands = {},
        object = null;

    for(let e in this.elements){
      object=this.create(e);
      commands["command_"+object.name]=object;
    }

    return commands;
  }

  createObject(id,commandInfo){
    return new commandInfo.constructor(
      id,
      commandInfo.name
    );
  }
};
