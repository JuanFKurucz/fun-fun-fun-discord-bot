"use strict";

/**
  This is the BotClass, pretty similar to the LogicClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the LogicClass
**/

const Discord = require("discord.js"),
      Message = require("./Message.js"), //https://discord.js.org/#/docs/main/stable/class/RichEmbed
      Logic = require(__dirname+"/logic/Logic.js"),
      {config} = require("./Configuration.js"),
      Graph = require("./graph/Graph.js");

let BotObject = null;

module.exports = class Bot {
  static get(){
    if(BotObject===null){
      BotObject = new Bot();
    }
    return BotObject;
  }

  constructor(debugMode=false) {
    this.prefix = config("prefix");
    this.userGraph = new Graph("1");
    this.logic = new Logic(this.prefix);
    this.client = new Discord.Client();
    this.debugMode = debugMode;
  }

  getPrefix(){
    return this.prefix;
  }

  async saveDatabase(){
    await this.logic.saveUsers();
  }

  async getUserGraph(){
    let users = await this.client.users.array(),
        lengthUsers = users.length;
    for(let u=0;u<lengthUsers;u++){
      this.userGraph.addNode(users[u].id,users[u]);
    }
    let guilds = await this.client.guilds.array(),
        lengthGuilds = guilds.length;
    for(let g=0;g<lengthGuilds;g++){
      let guildUsers = await guilds[g].members.array(),
          lengthGuildUsers = guildUsers.length;
      for(let u=0;u<lengthGuildUsers;u++){
        let node = this.userGraph.getNode(guildUsers[u].id);
        if(node!==null){
          for(let u2=0;u2<lengthGuildUsers;u2++){
            let node2 = this.userGraph.getNode(guildUsers[u2].id);
            if(node2!==null && !node.equalTo(node2)){
              node.addAdyacent(node2,1);
            }
          }
        }
      }
    }
    console.log(this.userGraph.print());
  }

  async start(token){
    await this.logic.loadUsers();
    this.client.on("ready", async () => {
      console.log(`Logged in as ${this.client.user.tag}!`,1);
      //await this.getUserGraph();
    });
    this.client.on("message", (msg) => {
      this.onMessage(msg);
    });
    this.client.login(token);
  }

  isACommand(text){
    return text.indexOf(this.prefix)===0;
  }

  /**
    commandHandler:

    This function gets a Discord Message object (https://discord.js.org/#/docs/main/stable/class/Message) as the only parameter
    With this Message it will decide if the content of the message is a command for the bot (if it starts with the prefix).
    It will execute the command for the prefix if it has one, if it doesn't it will do nothing instead.
  **/
  async commandHandler(msg,user){
    const text = msg.content+"";
    let response = null,
        command;

    let permissionLevel = (msg.member.hasPermission("ADMINISTRATOR")) ? 1 : 0;
    user.setPermission(permissionLevel);

    if(this.isACommand(text)){
      response = new Message(user); //Instances a new discord RichEmbed;

      console.log(msg.author.id +" sent "+msg.content,1);

      command = text.substring(this.prefix.length,text.length).toLowerCase().split(" "); //Splits the text of the message in spaces removing the prefix out of it

      console.time();

      await this.logic.getCommand(command[0],user).execute(response,user,command); //gets the command using the first string in the splitteed message and executes it
    }

    return response;
  }

  async sendMessage(msg,response,user){
    try{
      let message;
      console.log(response.text);
      console.log(response.attachment);
      if((response.text !== null && response.attachment !== null)){
        console.log("this one");
        message = await msg.channel.send(response.text,response.attachment);
      } else {
        console.log("not this one");
        message = await msg.channel.send(response);
      }
      await user.setLastResponse(message);
      console.log("Message sent");
    } catch(e){
      console.error(e);
    }
  }

  async onMessage(msg){
    const debugChannels = config("debuggChannels");
    if((debugChannels.indexOf(msg.channel.id)!==-1 || this.debugMode === false) && msg.hasOwnProperty("author") && !msg.author.bot){

      const user = await this.logic.getUser(msg.author);
      this.logic.onMessage(user); //handles what to do when a user send a message (Ex: gives cookies);
      const response=await this.commandHandler(msg,user);

      if(response!==null){
        await this.sendMessage(msg,response,user);
      }

      user.emptyMessageLang();
    }
  }
};
