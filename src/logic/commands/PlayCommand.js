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
    m.setTitle("play_title");

    if(command.length >= 2){
      if(logic.games.hasOwnProperty(user.id)){
        const game = logic.games[user.id];
        if(command[1] == "ff"){
          await logic.finishGame(0);
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
          m.attachment = {
            file: __dirname.replace("commands","game")+"/game.png" // Or replace with FileOptions object
          };
          let cord1 = ""; game.board.getCord(realCords[0]+""+realCords[1],true);
          let cord2 = "";game.board.getCord(realCords[2]+""+realCords[3],true);
          if(isNaN(realCords[0])){
            cord1=realCords[0]+""+(9-parseInt(realCords[1]));
          } else {
            cord1=realCords[1]+""+(9-parseInt(realCords[0]));
          }
          if(isNaN(realCords[2])){
            cord2=realCords[2]+""+(9-parseInt(realCords[3]));
          } else {
            cord2=realCords[3]+""+(9-parseInt(realCords[2]));
          }
          const response = await game.makeMove(user.id,cord1,cord2);
          m.text = response.text;
          if(response.status === false){
            await logic.finishGame(game,response.winner);
          } else {
            await logic.saveGame(game);
          }
        }
      } else {
        const againts = command[1].replace(/[\\<>@#&!]/g, "");
        if(!isNaN(againts)){
          m.text = await logic.startGame(user.id,againts);
          if(m.text !== null){
            m.attachment = {
              file: __dirname.replace("commands","game")+"/game.png" // Or replace with FileOptions object
            };
          }
        } else {
          m.setDescription("play_error");
        }
      }
    } else {
      m.setDescription("play_error");
    }

    console.time();
  }
};
