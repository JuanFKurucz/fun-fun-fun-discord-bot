"use strict";

const Command = require("../Command.js");

module.exports = class PlayCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    console.time();
    const bot = require("../../Bot.js").get(),
        commandList = bot.logic.getCommands();

    m.setTitle("help_title");
    m.setDescription("help_message");
    for(let i in commandList){
      m.addField(
        bot.getPrefix()+"^"+commandList[i].getName()+"^",
        {
          "text":"^"+commandList[i].getDescription()+"^",
          "data":[[bot.getPrefix(),"^"+commandList[i].getName()+"^"]],
          "style":"lower"
        }
      );
    }
    console.time();
  }
};
