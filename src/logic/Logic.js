"use strict";

/**
Logic Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/User.js"),
      { dbQuery } = require("../DataBase.js"),
      CommandConstructor = require(__dirname+"/constructors/CommandConstructor.js"),
      Language = require("../Language.js");

module.exports = class Logic {
  constructor(prefix) {
    this.users = {};
    this.commandConstructor = new CommandConstructor(prefix);
    this.commands = this.commandConstructor.initCommands();
    this.lanCommands = Language.getCommands();
  }

  async deleteUser(user){
    // TODO
    return;
  }

  async loadUsers(){
    // TODO
    return;
  }

  async saveUsers(){
    // TODO
    return;
  }

  getCommands(){
    return this.commands;
  }

  getCommand(command,user){
    const lan = user.getLanguage();
    let realCommand="command_error";
    if(this.lanCommands.hasOwnProperty(lan) === true && this.lanCommands[lan].hasOwnProperty(command)===true){
      realCommand=this.lanCommands[lan][command];
    }
    return this.commands[realCommand];
  }

  async getUser(info){
    if(this.users.hasOwnProperty(info.id) === false){
      this.users[info.id] = new User(info.id);
      await dbQuery("INSERT INTO user SET ?",{
        "id_user":info.id,
        "cookies":0
      });
    }
    this.users[info.id].setInfo(info);
    return this.users[info.id];
  }

  onMessage(user){
    user.resetResponses();
  }
};
