"use strict";

/**
Logic Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/User.js"),
{ dbQuery } = require("../DataBase.js"),
CommandConstructor = require(__dirname+"/constructors/CommandConstructor.js"),
Language = require("../Language.js"),
Chess = require("./game/chess.js");

module.exports = class Logic {
  constructor(prefix) {
    this.users = {};
    this.games = {};
    this.commandConstructor = new CommandConstructor(prefix);
    this.commands = this.commandConstructor.initCommands();
    this.lanCommands = Language.getCommands();
  }

  async deleteUser(user){
    // TODO
    return;
  }

  async saveGame(game,winner=0){
    const db_game = await dbQuery("SELECT * FROM chess WHERE id_chess = ?",[game.id]);
    const time_now = (new Date()).getTime();
    if(db_game === null || !db_game.length){
      console.log("inseration");
      const result = await dbQuery("INSERT INTO chess SET ?",{
        "active":game.playing,
        "state":JSON.stringify(game.board.state),
        "white":game.getPlayer("w").name,
        "black":game.getPlayer("b").name,
        "turn":game.getCurrentPlayer().team,
        "winner":winner,
        "time_start":time_now
      });
      game.id=result.insertId;
    } else {
      console.log("update");
      await dbQuery("UPDATE chess SET ? WHERE id_chess = "+game.id,{
        "active":game.playing,
        "state":JSON.stringify(game.board.state),
        "turn":game.getCurrentPlayer().team,
        "winner":winner,
        "time_end":time_now
      });
    }
  }

  async finishGame(game,winner){
    await saveGame(game,winner);
    for(let p in game.players){
      delete this.games[game.players[p].name];
    }
  }

  async startGame(id1,id2){;
    if(id2.length && id1.length && !this.games.hasOwnProperty(id1) && !this.games.hasOwnProperty(id2)){
      const game = new Chess();
      this.games[id1] = game;
      this.games[id2] = game;
      const response = await game.start(id1,id2);
      await this.saveGame(game);
      return response;
    } else {
      return null;
    }
  }

  async load(){
    const db_games = await dbQuery("SELECT * FROM chess WHERE active = 1");
    if(db_games !== null && db_games.length){
      for(let g in db_games){
        const game = new Chess(db_games[g].id_chess,db_games[g].state);
        game.load(db_games[g].white,db_games[g].black,db_games[g].turn);
        this.games[db_games[g].black] = game;
        this.games[db_games[g].white] = game;
      }
    }
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
        "id_user":info.id
      });
    }
    this.users[info.id].setInfo(info);
    return this.users[info.id];
  }

  onMessage(user){
    user.resetResponses();
  }
};
