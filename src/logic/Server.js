"use strict";
const { dbQuery } = require("../DataBase.js");

const possibleChannelTypes = {
  "chess":true
}

class Server {
  constructor(id) {
    this.id=id;
    this.channels = {};
    this.language="en";
  }

  setLanguage(lan){
    this.language=lan;
  }

  addChannel(type,id){
    if(possibleChannelTypes.hasOwnProperty(type)){
      this.channels[id] = type;
      return true;
    } else {
      return false;
    }
  }

  removeChannel(id){
    if(this.channels.hasOwnProperty(id)){
      delete this.channels[id];
      return true;
    }
    return false;
  }

  async save(){
    const json = {};
    json.channels = this.channels;
    json.language = this.language;
    const exists = await dbQuery("SELECT config FROM server WHERE ?",{
      "id_server":this.id
    });
    if(exists !== null && exists.length){
      await dbQuery("UPDATE server SET ? WHERE id_server = '"+this.id+"'",{
        "config":JSON.stringify(json)
      });
    } else {
      await dbQuery("INSERT INTO server SET ?",{
        "id_server":this.id,
        "config":JSON.stringify(json)
      });
    }
  }

  async load(){
    const data = await dbQuery("SELECT config FROM server WHERE ?",{
      "id_server":this.id
    });
    if(data !== null && data.length){
      const json = JSON.parse(data[0]["config"]);
      this.fromJson(json);
    } else {
      await this.save();
    }
  }

  fromJson(json){
    this.channels = json.channels;
    this.language = json.language;
  }
};


Server.get = async function(id){
  const exists = await dbQuery("SELECT config FROM server WHERE ?",{
    "id_server":id
  });
  const s = new Server(id);
  if(exists !== null && exists.length){
    s.fromJson(JSON.parse(exists[0]["config"]));
  } else {
    s.save();
  }
  return s;
}

module.exports = Server;
