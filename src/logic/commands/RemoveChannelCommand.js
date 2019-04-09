"use strict";

const path = require("path");
const Command = require("../Command.js");

module.exports = class PlayCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    console.time();
    const bot = require("../../Bot.js").get();
    const logic = bot.logic;

    if(user.getPermission()==1){
      const server = await logic.getServer(m.server);
      if(server.removeChannel(m.channel)){
        await server.save();
      }
      m.setDescription("Channel successfully removed");
    } else {
      m.setTitle("permission_error_title");
      m.setDescription("permission_error_error");
    }

    console.time();
  }
};
