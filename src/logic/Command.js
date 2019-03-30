"use strict";

module.exports = class Command {
  constructor(id,name,description="") {
    this.id=id;
    this.name=name;
    this.description=description;
    this.permission = 0;
  }

  getName(){
    return "command_"+this.name;
  }

  getId(){
    return this.id;
  }

  getDescription(){
    return "command_"+this.name.toLowerCase()+"_description";
  }

  async execute(m,user,command){
    if(user.getPermission()>=this.permission){
      await this.doExecute(m,user,command);
    } else {
      m.setTitle("Not enough permissions");
      m.setDescription("You don't have enough permissions to use this command. (Command permission level: "+this.permission+")");
    }
  }
};
