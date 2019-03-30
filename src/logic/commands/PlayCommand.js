"use strict";

const path = require("path");
const Command = require("../Command.js");
const Chess = require(path.join(__dirname, '..', '/game/chess.js'));

const games = {};

module.exports = class PlayCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    console.time();

    m.setTitle("play_title");

    if(command.length >= 2){
      if(games.hasOwnProperty(user.id)){
        const game = games[user.id];
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
        m.text = await game.makeMove(user.id,cord1,cord2);
        console.log(m.text);
      } else {
        const againts = command[1].replace(/[\\<>@#&!]/g, "");
        if(againts.length && !games.hasOwnProperty(againts)){
          const game = new Chess();
          m.attachment = {
            file: __dirname.replace("commands","game")+"/game.png" // Or replace with FileOptions object
          };
          games[againts] = game;
          games[user.id] = game;
          m.text = await game.start(user.id,againts);
          console.log(m.text);
        }
      }
    } else {
      m.setDescription("play_error");
    }

    console.time();
  }
};
