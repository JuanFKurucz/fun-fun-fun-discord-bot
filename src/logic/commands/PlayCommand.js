"use strict";

const path = require("path");
const Command = require("../Command.js");
const Message = require("../../Message.js");
const Attachment = require("discord.js").Attachment;

module.exports = class PlayCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    console.time();
    const bot = require("../../Bot.js").get();
    const logic = bot.logic;
    m.setTitle("Chess");
    const againts = command[1].replace(/[\\<>@#&!]/g, "");
    if(command.length >= 2){
      if(command[1][0]==bot.prefix){
        m.send = false;
      } else {
        if(logic.games.hasOwnProperty(user.id)){
          if(isNaN(againts)){
            const game = logic.games[user.id];
            if(command[1] == "ff"){
              await logic.finishGame(game,game.players[game.players.indexOf(game.getPlayerById(user.id))+1%2].name);
              m.setDescription("game finished");
            } else {
              command.shift();
              const message = command.join("").toString().trim().toLowerCase();
              const realCords=[];
              for(let m in message){
                const ascii = message.charCodeAt(m);
                if((ascii>= 97 && ascii<=122) || (ascii>=49 && ascii<=57)){
                  realCords.push(message[m]);
                }
              }
              let cord1 = "";
              if(isNaN(realCords[0])){
                cord1=realCords[0]+""+(9-parseInt(realCords[1]));
              } else {
                cord1=realCords[1]+""+(9-parseInt(realCords[0]));
              }
              if(message.length==4){
                let cord2 = "";
                if(isNaN(realCords[2])){
                  cord2=realCords[2]+""+(9-parseInt(realCords[3]));
                } else {
                  cord2=realCords[3]+""+(9-parseInt(realCords[2]));
                }
                const response = await game.makeMove(user.id,cord1,cord2);
                m.text = response.text;
                m.attachment = new Attachment(await game.draw(),"chess.png");
                if(response.status === false){
                  await logic.finishGame(game,response.winner);
                } else {
                  await logic.saveGame(game);
                }
              } else if(message.length == 2){
                const response = await game.possibleMoves(user.id,cord1);
                m.text = response.text;
                m.attachment = new Attachment(response.buffer,"chess.png");
                await logic.saveGame(game);
              } else {
                m.send = false;
              }
            }
          } else {
            m.setDescription("You can't start a game you are already playing one");
          }
        } else {
          if(!isNaN(againts)){
            m.reactions = ["✔","❌"];
            m.savedStuff = {
              "users":[user.id,againts]
            };
            m.reactionTarget=[againts];
            m.reactionCallback = async function(m,collected){
              await m.sentMessage.clearReactions();
              if(collected === false){
                await m.sentMessage.edit("Invitation to play from <@!"+m.savedStuff["users"][0]+"> to <@!"+m.savedStuff["users"][1]+"> expired");
              } else {
                const reaction = collected.first();
                if (reaction.emoji.name === m.reactions[0]) {
                  const newMessage = new Message(m.server,m.channel,m.owner);
                  newMessage.text = await logic.startGame(m.savedStuff["users"][0],m.savedStuff["users"][1]);
                  if(newMessage.text !== null){
                    const game = logic.games[user.id];
                    newMessage.attachment = new Attachment(await game.draw(),"chess.png");
                    await m.sentMessage.channel.send(newMessage.text,newMessage.attachment);
                  } else {
                    await m.sentMessage.edit("Unexpected error");
                  }
                } else {
                  await m.sentMessage.edit("Invitation from <@!"+m.savedStuff["users"][0]+"> to <@!"+m.savedStuff["users"][1]+"> denied");
                }
              }
            };
            m.text = "Hey <@!"+againts+">, <@!"+user.id+"> invited you to a chess game. Do you wanna play? Answer reacting to this message";
          } else {
            m.send = false;
          }
        }
      }
    } else {
      m.setDescription("play_error");
    }

    console.time();
  }
};
