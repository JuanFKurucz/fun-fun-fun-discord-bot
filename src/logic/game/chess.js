"use strict";
const Player = require('./player');
const Board = require('./Board');
const Data = require('./data.json');
const base64ToImage = require('base64-to-image');
const { createCanvas, loadImage } = require('canvas');
const width=690;
const height=690;
const canvas = createCanvas(690, 690);
const ctx = canvas.getContext('2d');

class Chess {
  constructor(id=null,state = null) {
    this.id = id;
    this.playing=false;
    this.squareWidth = 80;
    this.squareHeight = 80;
    this.squareColors = ["#FECEA0","#D18B47"];
    this.margins = {
      top:25,
      left:25
    };
    if(state === null){
      this.board=new Board(this,JSON.parse(JSON.stringify(Board.startState)));
    } else {
      this.board=new Board(this,state);
    }
    this.currentTurn=0;
  }

  getPlayer(team){
    for(let p in this.players){
      if(this.players[p].team == team){
        return this.players[p];
      }
    }
  }

  nextTurn(){
    this.currentTurn++;
    this.currentTurn%=this.players.length;
  }

  tryMakeMove(piece,to){
    if(piece.move(this.board,to)){
      let newState = this.board.cloneState();
      newState=this.board.move(piece,to,newState);
      if(this.board.kingInCheck(this.players[this.currentTurn].team,newState)){
        console.log("King in check");
        return false;
      } else {
        console.log("King alright");
        return true;
      }
    } else {
      return false;
    }
  }

  getCurrentPlayer(){
    return this.players[this.currentTurn];
  }

  getOtherPlayer(){
    return this.players[(this.players.indexOf(this.getCurrentPlayer())+1)%2];
  }

  getPlayerById(id){
    for(let p in this.players){
      if(this.players[p].name == id){
        return this.players[p];
      }
    }
    return null;
  }

  async makeMove(player,coordinate,new_coordinate){
    let message = "";
    const currentPlayer = this.getPlayerById(player);
    if(currentPlayer !== null){
      if(currentPlayer.name == this.getCurrentPlayer().name){
        if(coordinate.length==2 && new_coordinate.length==2){
          const cord = this.board.getCord(coordinate);
          const piece = this.board.getPiece(cord);
          if(piece!=null && piece.text!=""){
            if(piece.team == this.getCurrentPlayer().team){
              const new_cord = this.board.getCord(new_coordinate.toLowerCase());
              if(this.tryMakeMove(piece,new_cord)){
                this.board.move(piece,new_cord);
                this.nextTurn();
                await this.draw();
                if(this.board.kingInCheck(this.getCurrentPlayer().team,this.board.state)){
                  if(this.board.checkMate(this.getCurrentPlayer().team,this.board.state)){
                    this.playing=false;
                    message="Game ended, winner: "+this.getOtherPlayer().mention();
                  } else {
                    message="Next turn: be aware your king is in check "+this.getCurrentPlayer().mention()+" you are "+this.getCurrentPlayer().printTeam();
                  }
                } else {
                  message="Next turn "+this.getCurrentPlayer().mention()+" you are "+this.getCurrentPlayer().printTeam();
                }
              } else {
                message=currentPlayer.mention()+" you can't make this move";
              }
            } else {
              message=currentPlayer.mention()+" that piece doesn't belong to you, you are "+this.getCurrentPlayer().printTeam();
            }
          } else {
            message=currentPlayer.mention()+" that's an empty field";
          }
        } else {
          message=currentPlayer.mention()+" the coordinates are wrong";
        }
      } else {
        message=currentPlayer.mention()+" it isn't your turn";
      }
    } else {
      message="Unexpected error";
    }
    return {text:message,status:this.playing};
  }

  load(white,black,turn){
    const player1 = new Player(white);
    const player2 = new Player(black);

    this.players=[player1,player2];
    this.playing=true;
    this.players[0].assignColor("w");
    this.players[1].assignColor("b");

    if(turn === "w"){
      this.currentTurn=0;
    } else {
      this.currentTurn=1;
    }
  }

  async start(id1,id2){

    const player1 = new Player(id1);
    const player2 = new Player(id2);

    this.players=[player1,player2];
    this.playing=true;

    let firstPlayer = Math.floor(Math.random() * this.players.length);
    this.players[firstPlayer].assignColor("w");
    this.currentTurn=firstPlayer;
    this.players[(firstPlayer+1)%this.players.length].assignColor("b");

    await this.draw();
    return "It's the turn of "+this.getCurrentPlayer().mention()+" you are "+this.getCurrentPlayer().printTeam();
  }

  drawCoordinates(){
    const letters=["a","b","c","d","e","f","g","h"];
    const numbers=[8,7,6,5,4,3,2,1];

    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    for(let l in letters){
      ctx.fillText(
        letters[l],
        parseInt(this.margins.left+this.squareWidth/2+this.squareWidth*l),
        20
      );
      ctx.fillText(
        letters[l],
        parseInt(this.margins.left+this.squareWidth/2+this.squareWidth*l),
        height-5
      );
    }
    for(let n in numbers){
      ctx.fillText(
        numbers[n],
        5,
        parseInt(this.margins.top+this.squareHeight/2+this.squareHeight*n),
      );
      ctx.fillText(
        numbers[n],
        width-20,
        parseInt(this.margins.top+this.squareHeight/2+this.squareHeight*n),
      );
    }
  }

  drawBackGround(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    let x=0;
    let y=0;
    for(let i=0;i<64;i++){
      x=i%8;
      y=parseInt(i/8);
      if(y%this.squareColors.length==0){
        ctx.fillStyle = this.squareColors[i%this.squareColors.length];
      } else {
        ctx.fillStyle = this.squareColors[((1+i)%this.squareColors.length)];
      }
      ctx.fillRect(this.margins.left+(x*this.squareWidth), this.margins.top+y*this.squareHeight, this.squareWidth, this.squareHeight);
    }
  }

  async getImage(path){
    return await (new Promise(function(resolve,reject){
      loadImage(path).then((image) => {
        resolve(image);
      });
   }));
  }

  async drawGame(){
    let x=0;
    let y=0;
    for(let i in this.board.state){
      if(this.board.state[i]){
        x=i%8;
        y=parseInt(i/8);
        const image = await this.getImage(__dirname+"/images/"+this.board.state[i]+".png");
        ctx.drawImage(image, this.margins.left+(x*this.squareWidth), this.margins.top+(y*this.squareHeight), this.squareWidth, this.squareHeight);
      }
    }
    await this.save();
  }

  async save(){
    var optionalObj = {'fileName': 'game', 'type':'png'};
    await base64ToImage(canvas.toDataURL(),__dirname+"/",optionalObj);
  }

  async draw(){
    this.drawBackGround();
    this.drawCoordinates();
    await this.drawGame(this.state);
    await this.save();
  }
};

module.exports = Chess;
