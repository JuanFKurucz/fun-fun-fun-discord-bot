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

    if(command.length>=2 && command[1]){
      if(user.getPermission()==1){
        const server = await logic.getServer(m.server);
        if(server !== null){
          console.log(server);
          if(server.addChannel(command[1].toLowerCase(),m.channel)){
            await server.save();
            m.setDescription("Channel type successfully changed");
          } else {
            m.setDescription("Can't set this type to the channel");
          }
        }
      } else {
        m.setTitle("permission_error_title");
        m.setDescription("permission_error_error");
      }
    } else {
      m.setDescription("setchannel_error");
    }

    console.time();
  }
};
