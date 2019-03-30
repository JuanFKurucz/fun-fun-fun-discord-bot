"use strict";
const Player = require('./Player');
const Board = require('./Board');
const Data = require('./data.json');
const base64ToImage = require('base64-to-image');
const { createCanvas, loadImage } = require('canvas');
const width=690;
const height=690;
const canvas = createCanvas(690, 690);
const ctx = canvas.getContext('2d');

class Chess {
  constructor() {
    this.playing=false;
    this.squareWidth = 80;
    this.squareHeight = 80;
    this.squareColors = ["#FECEA0","#D18B47"];
    this.margins = {
      top:25,
      left:25
    };
    this.board=new Board(this,Board.startState);
    this.players=[new Player(),new Player()];
    this.currentTurn=0;
    this.start();
  }

  endGame(state,team){
    for(let s in state){
      if(true){

      }
    }
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

  async makeMove(player,coordinate,new_coordinate){
    if(player == this.currentTurn){
      const currentPlayer = this.players[player];
      console.log(coordinate, new_coordinate);
      if(coordinate.length==2 && new_coordinate.length==2){
        const cord = this.board.getCord(coordinate);
        const piece = this.board.getPiece(cord);
        //console.log(piece);
        if(piece.text!=""){
          if(piece.team == currentPlayer.team){
            const new_cord = this.board.getCord(new_coordinate.toLowerCase());
            if(this.tryMakeMove(piece,new_cord)){
              this.board.move(piece,new_cord);
              this.currentTurn++;
              this.currentTurn%=this.players.length;
              await this.draw();
              console.log("Next turn");
            } else {
              console.log("You can't make this move");
              this.playing=false;
            }
          } else {
            console.log("This piece doens't belong to you");
            this.playing=false;
          }
        } else {
          console.log("Empty field");
          this.playing=false;
        }
      } else {
        console.log(coordinate,new_coordinate);
        console.log("Coordinates are wrong");
      }
    } else {
      console.log("Not your turn");
    }
  }

  async start(){
    this.playing=true;
    let firstPlayer = Math.floor(Math.random() * this.players.length);
    this.players[firstPlayer].assignColor("w");
    this.currentTurn=firstPlayer;
    this.players[(firstPlayer+1)%this.players.length].assignColor("b");
    await this.draw();
  }

  drawCoordinates(){
    const letters=["a","b","c","d","e","f","g","h"];
    const numbers=[1,2,3,4,5,6,7,8];

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
        const image = await this.getImage("images/"+this.board.state[i]+".png");
        ctx.drawImage(image, this.margins.left+(x*this.squareWidth), this.margins.top+(y*this.squareHeight), this.squareWidth, this.squareHeight);
        this.save();
      }
    }
  }

  save(){
    var optionalObj = {'fileName': 'game', 'type':'png'};
    base64ToImage(canvas.toDataURL(),"./",optionalObj);
  }

  async draw(){
    /* Console debugg*/
    let text = "";
    for(let s in this.board.state){
      if(s%8==0){
        text+="\n";
      }
      if(this.board.state[s]==""){
        text+="   ";
      } else {
        text+=this.board.state[s]+" ";
      }
    }
    console.log(text);

    this.drawBackGround();
    this.drawCoordinates();
    await this.drawGame(this.state);
    this.save();
  }
};

const game = new Chess();

async function start(){
  let moves = Data.game;
  for(let d in moves){
    const message = moves[d].toString().trim().toLowerCase();
    const realCords=[];
    for(let m in message){
      const ascii = message.charCodeAt(m);
      if((ascii>= 97 && ascii<=122) || (ascii>=49 && ascii<=57)){
        realCords.push(message[m]);
      }
    }
    console.log("RealCords:",realCords);
    game.makeMove(game.currentTurn,realCords[0]+""+parseInt(9-parseInt(realCords[1]))+"",realCords[2]+""+parseInt(9-parseInt(realCords[3]))+"");
    if(!game.playing){
      break;
    }
  }
  process.exit();
}

start();
/*
var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  const message = d.toString().trim().toLowerCase();
  const realCords=[];
  for(let m in message){
    const ascii = message.charCodeAt(m);
    if((ascii>= 97 && ascii<=122) || (ascii>=49 && ascii<=57)){
      realCords.push(message[m]);
    }
  }
  if(realCords.length==2){
    const cord = game.board.getCord(realCords[0]+""+realCords[1]);
    const piece = game.board.getPiece(game.state,cord);
    if(piece.text!=""){
      game.board.possibleMoves(piece);
    }
  } else {
    game.makeMove(game.currentTurn,realCords[0]+""+realCords[1]+"",realCords[2]+""+realCords[3]+"");
  }
});*/

module.exports = Chess;
