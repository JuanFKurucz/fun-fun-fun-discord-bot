"use strict";

const Player = require('./Player');
const base64ToImage = require('base64-to-image');
const { createCanvas, loadImage } = require('canvas');
const width=690;
const height=690;
const canvas = createCanvas(690, 690);
const ctx = canvas.getContext('2d');

const pieces = {
  "bk":"blackKing",
  "bq":"blackQueen",
  "bn":"blackKnight",
  "bb":"blackBishop",
  "br":"blackRook",
  "bp":"blackPawn",

  "wk":"whiteKing",
  "wq":"whiteQueen",
  "wn":"whiteKnight",
  "wb":"whiteBishop",
  "wr":"whiteRook",
  "wp":"whitePawn"
};

class Chess {
  constructor() {
    this.squareWidth = 80;
    this.squareHeight = 80;
    this.squareColors = ["#FECEA0","#D18B47"];
    this.state=[];
    this.margins = {
      top:25,
      left:25
    };
    this.players=[new Player(),new Player()];
    this.currentTurn=0;
    this.start();
  }

  async start(){
    let firstPlayer = Math.floor(Math.random() * this.players.length);
    this.players[firstPlayer].assignColor("white");
    this.currentTurn=firstPlayer;
    this.players[(firstPlayer+1)%this.players.length].assignColor("black");

    this.state=[
      "br","bn","bb","bq","bk","bb","bn","br",
      "bp","bp","bp","bp","bp","bp","bp","bp",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "wp","wp","wp","wp","wp","wp","wp","wp",
      "wr","wn","wb","wq","wk","wb","wn","wr"
    ];

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

  async drawGame(state){
    let x=0;
    let y=0;
    for(let i in state){
      if(state[i]){
        x=i%8;
        y=parseInt(i/8);
        const image = await this.getImage("images/"+pieces[state[i]]+".png");
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
    this.drawBackGround();
    this.drawCoordinates();
    await this.drawGame(this.state);
    this.save();
  }
};

const game = new Chess();


module.exports = Chess;
