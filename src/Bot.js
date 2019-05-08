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
const Server = require("./logic/Server.js");
const SpellChecker = require('spellchecker');
const writeGood = require('write-good');
const nodehun = require('nodehun');
const fs = require("fs");
var affbuf = fs.readFileSync(__dirname+'/en_US.aff');
var dictbuf = fs.readFileSync(__dirname+'/en_US.dic');
var dict = new nodehun(affbuf,dictbuf);

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
    this.client.on("ready", async () => {
      console.log(`Logged in as ${this.client.user.tag}!`,1);
      await this.logic.loadServers(await this.client.guilds.array());
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

    if(msg.channel.id=="166679130228785152" && msg.author.id!="162355874570960896"){
      let reacted=false;
      const words = text.split(" ");
      const wrongly = writeGood(text);
      console.info(wrongly);
      if(wrongly.length){
        msg.reply(wrongly[0].reason);
      }
      for(let w in words){
        const word = words[w].replace(/[^a-z]/gi, '');
        if(word.length){
          dict.spellSuggest(word,async function(err, correct, suggestion, origWord){
            console.log(err, correct, suggestion, origWord);
            // because "calor" is not a defined word in the US English dictionary
            // the output will be: null, false, "carol", 'calor'
            if(correct == false){
              msg.reply(origWord+" is misspelled, here it is a suggestion: "+suggestion);
              try{
                await msg.react("🇼");
                await msg.react("🇷");
                await msg.react("🇴");
                await msg.react("🇳");
                await msg.react("🇬");
              } catch(e){
                const newName = origWord+" is misspelled (UNBLOCK THE BOT)";
                if(newName.length<=32){
                  msg.guild.members.get(msg.author.id).setNickname(newName);
                } else {
                  msg.guild.members.get(msg.author.id).setNickname("YOU ARE WRONG (UNBLOCK THE BOT)");
                }
              }
            }
          });
        }
        /*
        if(SpellChecker.isMisspelled(word)){
          const corrections = SpellChecker.getCorrectionsForMisspelling(word);
          if(corrections.length){
            msg.reply(word+" is misspelled, here are some possible corrections: "+corrections.join(", "));
            if(reacted){
              try{
                await msg.react("🇼");
                await msg.react("🇷");
                await msg.react("🇴");
                await msg.react("🇳");
                await msg.react("🇬");
              } catch(e){
                const newName = word+" is misspelled (UNBLOCK THE BOT)";
                if(newName.length<=32){
                  msg.guild.members.get(msg.author.id).setNickname(newName);
                } else {
                  msg.guild.members.get(msg.author.id).setNickname("YOU ARE WRONG (UNBLOCK THE BOT)");
                }
              }
            }
          }
        }
        */
      }
    }
    /*if(text.split(" ").length==1 && msg.author.id=="162355874570960896"){
      const cleanText = text.replace(/[^a-z]/gi, '');
      console.info(cleanText);
      msg.channel.fetchMessages({ limit: 10 })
      .then((messages) => {
        const mm = messages.array();
        console.info(mm);
        for(let m in mm){
          console.info(mm[m].id != msg.id,mm[m].content.includes(cleanText));
          if(mm[m].id != msg.id && mm[m].content.includes(cleanText)){
            msg.delete(100);
          }
        }
      })
      .catch(console.info);
    } else {
      const server = await this.logic.getServer(msg.channel.guild.id);
      const boolDesignatedChannel = server.channels.hasOwnProperty(msg.channel.id);
      if(this.isACommand(text) || boolDesignatedChannel){
        response = new Message(msg.channel.guild.id,msg.channel.id,user); //Instances a new discord RichEmbed;
        console.log(msg.author.id +" sent "+msg.content,1);
        command = text.toLowerCase().split(" ");
        if(boolDesignatedChannel){
          command.unshift(this.prefix+server.channels[msg.channel.id]);
        }
        command[0] = command[0].substring(this.prefix.length,command[0].length); //Splits the text of the message in spaces removing the prefix out of it
        console.time();

        await this.logic.getCommand(command[0],user).execute(response,user,command); //gets the command using the first string in the splitteed message and executes it
      }
    }*/
    return response;
  }

  async sendMessage(msg,response,user){
    try{
      let message;
      if(response.send){
        if((response.text !== null && response.attachment !== null)){
          message = await msg.channel.send(response.text,response.attachment);
        } else if(response.text !== null) {
          message = await msg.channel.send(response.text);
        } else {
          message = await msg.channel.send(response.message);
        }
        response.setSentMessage(message);
        await user.setLastResponse(message);
        console.log("Message sent");
      }
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
