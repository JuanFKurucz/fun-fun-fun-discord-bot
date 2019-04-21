"use strict";

/**
  This index.js is meant to work as any main file of any project.

  Here are the main variables that we need to start the bot, token and botId, in the future there will be databases credentials.

  Here we just call for Bot and DataBase classes and start them.
**/

const Bot = require(__dirname+"/Bot.js"),
      Logger = require(__dirname+"/Logger.js"),
      { dbChangeEnable } = require(__dirname+"/DataBase.js");


module.exports = class Main {
  constructor() {
    this.data = {};
  }

  async exitHandler(options, exitCode) {
    await Bot.get().saveDatabase();
    options.cleanup && console.log("clean",0);
    (exitCode || exitCode === 0) && console.log("exitCode",exitCode,0);
    options.exit && process.exit();
  }

  onExit(){
    //do something when app is closing
    process.on("exit", this.exitHandler.bind(null,{cleanup:true}));
    //catches ctrl+c event
    process.on("SIGINT", this.exitHandler.bind(null,{exit:true}));
    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", this.exitHandler.bind(null,{exit:true}));
    process.on("SIGUSR2", this.exitHandler.bind(null,{exit:true}));
    //catches uncaught exceptions
    process.on("uncaughtException", this.exitHandler.bind(null,{exit:true}));
  }

  async configuration(){
    console.log("Loading configuration");

    process.argv.forEach((val, index) => {
      if(val.includes("=")){
        let d = val.split("=");
        this.data[d[0]]=d[1];
      }
    });

    Logger.init(this.data["level"],this.data["maxTrace"],false);
    console.log("Logger started");
    await dbChangeEnable(this.data["database"]);

    console.log("Configuration of Logger at level "+Logger.get().getLevel(),1);
  }

  async start(token){
    console.log("Starting Everything");
    await this.configuration();
    console.log("Starting bot please wait...",1);
    this.botObject = Bot.get();
    console.log("Bot created",1);
    process.stdin.resume();//so the program will not close instantly
    this.onExit();
    await this.botObject.start(token);
    console.log("Bot initiated",1);
  }
};
