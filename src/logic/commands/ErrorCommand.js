"use strict";

const Command = require("../Command.js");

module.exports = class ErrorCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    console.time();
    const prefix = require("../../Bot.js").get().getPrefix();
    m.setTitle("error_title");
    m.setDescription("error_message",[prefix,"^command_help^"]);
    console.time();
  }
};
