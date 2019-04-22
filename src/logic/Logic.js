"use strict";

/**
Logic Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/User.js");
const Server = require(__dirname+"/Server.js");
const { dbQuery } = require("../DataBase.js");
const CommandConstructor = require(__dirname+"/constructors/CommandConstructor.js");
const Language = require("../Language.js");
const Chess = require("./games/chess/");

module.exports = class Logic {
  constructor(prefix) {
    this.servers = {};
    this.users = {};
    this.games = {};
    this.commandConstructor = new CommandConstructor(prefix);
    this.commands = this.commandConstructor.initCommands();
    this.lanCommands = Language.getCommands();
  }

  async getServer(id){
    if(this.servers.hasOwnProperty(id)){
      return this.servers[id];
    } else {
      const s = Server.get(id);
      if(s !== null){
        this.servers[id] = s;
      }
      return s;
    }
  }

  async deleteUser(user){
    // TODO
    return;
  }

  async saveGame(game,winner=0){
    const time_now = (new Date()).getTime();
    let playing;
    if(game.playing){
      playing=1;
    } else {
      playing=0;
    }
    if(game.id === null){
      console.log("insert");
      const result = await dbQuery("INSERT INTO chess SET ?",{
        "active":playing,
        "state":JSON.stringify(game.board.state),
        "movements":JSON.stringify(game.board.movements),
        "white":game.getPlayer("w").name,
        "black":game.getPlayer("b").name,
        "turn":game.getCurrentPlayer().team,
        "winner":winner,
        "time_start":time_now
      });
      if(result){
        game.id=result.insertId;
      } else {
        for(let p in game.players){
          delete this.games[game.players[p].name];
        }
      }
    } else {
      console.log("update");
      const result = await dbQuery("UPDATE chess SET ? WHERE id_chess = "+game.id,{
        "active":playing,
        "state":JSON.stringify(game.board.state),
        "movements":JSON.stringify(game.board.movements),
        "turn":game.getCurrentPlayer().team,
        "winner":winner,
        "time_end":time_now
      });
    }
  }

  async finishGame(game,winner){
    console.log(winner);
    game.playing=false;
    await this.saveGame(game,winner);
    for(let p in game.players){
      delete this.games[game.players[p].name];
    }
  }

  async startGame(id1,id2){
    if(id2.length && id1.length && !this.games.hasOwnProperty(id1) && !this.games.hasOwnProperty(id2)){
      const game = new Chess();
      this.games[id1] = game;
      this.games[id2] = game;
      const response = game.start(id1,id2);
      console.log("game started");
      await this.saveGame(game);
      console.log("game saved");
      return response;
    } else {
      return null;
    }
  }

  async load(){
    const db_games = await dbQuery("SELECT * FROM chess WHERE active = 1");
    if(db_games !== null && db_games.length){
      for(let g in db_games){
        const game = new Chess(db_games[g].id_chess,JSON.parse(db_games[g].state),JSON.parse(db_games[g].movements));
        game.load(db_games[g].white,db_games[g].black,db_games[g].turn);
        this.games[db_games[g].black] = game;
        this.games[db_games[g].white] = game;
      }
    }
  }

  async loadServers(guilds){
    let lengthGuilds = guilds.length;
    for(let g = 0; g < lengthGuilds; g++){
      this.servers[guilds[g].id] = new Server(guilds[g].id);
      await this.servers[guilds[g].id].load();
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
