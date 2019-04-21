"use strict";
const path = require("path");
const Coordinate = require('./Coordinate');
const Player = require('./player');
const Board = require('./Board');
const Data = require('./data.json');
const base64ToImage = require('base64-to-image');
const { createCanvas, loadImage } = require('canvas');
const width=690;
const height=690;
const canvas = createCanvas(690, 690);
const ctx = canvas.getContext('2d');
Canvas.registerFont('arial.ttf', { family: 'Arial' });

class Chess {
  constructor(id_chess=null,state = null, movements = null) {
    this.id = id_chess;
    this.playing=false;
    this.squareWidth = 80;
    this.squareHeight = 80;
    this.squareColors = ["#FECEA0","#D18B47"];
    this.margins = {
      top:25,
      left:25
    };
    if(state === null){
      this.board=new Board(this,JSON.parse(JSON.stringify(Board.startState)),[]);
    } else {
      this.board=new Board(this,state,movements);
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

  async possibleMoves(player,coordinate){
    let message = "";
    let bufferImage;
    const currentPlayer = this.getPlayerById(player);
    if(currentPlayer !== null){
      if(coordinate.length==2){
        const cord = this.board.getCord(coordinate);
        const piece = this.board.getPiece(cord);
        if(piece!=null){
          const moves = this.board.possibleMoves(piece);
          if(moves.length===0){
            message=currentPlayer.mention()+", the piece can't be moved";
          } else {
            bufferImage = await this.draw(moves);
            message=currentPlayer.mention()+", moves are marked with a green circle";
          }
        } else {
          message=currentPlayer.mention()+" that's an empty field";
        }
      } else {
        message=currentPlayer.mention()+" the coordinate is wrong";
      }
    } else {
      message="Unexpected error";
    }
    return {buffer:bufferImage,text:message,status:this.playing};
  }

  async makeMove(player,coordinate,new_coordinate){
    let message = "";
    const currentPlayer = this.getPlayerById(player);
    if(currentPlayer !== null){
      if(currentPlayer.name == this.getCurrentPlayer().name){
        if(coordinate.length==2 && new_coordinate.length==2){
          const cord = this.board.getCord(coordinate);
          const piece = this.board.getPiece(cord);
          if(piece!=null){
            if(piece.team == this.getCurrentPlayer().team){
              const new_cord = this.board.getCord(new_coordinate.toLowerCase());
              if(this.tryMakeMove(piece,new_cord)){
                this.board.movements.push(cord.text+""+new_cord.text);
                this.board.move(piece,new_cord);
                this.nextTurn();
                if(this.board.kingInCheck(this.getCurrentPlayer().team,this.board.state)){
                  if(this.board.checkMate(this.getCurrentPlayer().team,this.board.state)){
                    this.playing=false;
                    message="Game ended, winner: "+this.getOtherPlayer().mention();
                  } else {
                    message="Next turn: be aware your king is in check "+this.getCurrentPlayer().mention()+" you are "+this.getCurrentPlayer().printTeam()+"\nPast move blue circle to red circle";
                  }
                } else {
                  message="Next turn "+this.getCurrentPlayer().mention()+" you are "+this.getCurrentPlayer().printTeam()+"\nPast move blue circle to red circle";
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

  drawBackGround(moves){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    let x=0;
    let y=0;

    const realMoves = [];
    if(moves !== null){
      for(let m in moves){
        realMoves.push(moves[m].text);
      }
    }

    const lastMove = (this.board.movements.length) ? this.board.movements[this.board.movements.length-1] : null;
    const cord1 = (lastMove != null) ? lastMove.substring(0,2) : null;
    const cord2 = (lastMove != null) ? lastMove.substring(2,4) : null;
    let border = "";
    for(let i=0;i<64;i++){
      x=i%8;
      y=parseInt(i/8);
      if(cord1 !== null && cord2 !== null){
        if(Coordinate.all[i]==cord1){
          border = "rgba(0, 0, 255, 0.3)";
        } else if(Coordinate.all[i]==cord2){
          border = "rgba(255, 0, 0, 0.3)";
        } else {
          border = "";
        }
      }

      if(y%this.squareColors.length==0){
        ctx.fillStyle = this.squareColors[i%this.squareColors.length];
      } else {
        ctx.fillStyle = this.squareColors[((1+i)%this.squareColors.length)];
      }

      ctx.fillRect(this.margins.left+(x*this.squareWidth), this.margins.top+y*this.squareHeight, this.squareWidth, this.squareHeight);

      if(border !== ""){
        ctx.fillStyle = border;
        ctx.beginPath();
        ctx.arc(
          (this.margins.left+(x*this.squareWidth))+parseInt(this.squareWidth/2),
          (this.margins.top+y*this.squareHeight)+parseInt(this.squareHeight/2),
          parseInt(this.squareWidth/2)-5, 0, 2 * Math.PI);
          ctx.fill();
        }

        if(realMoves.indexOf(Coordinate.all[i]) !== -1){
          ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
          ctx.beginPath();
          ctx.arc(
            (this.margins.left+(x*this.squareWidth))+parseInt(this.squareWidth/2),
            (this.margins.top+y*this.squareHeight)+parseInt(this.squareHeight/2),
            parseInt(this.squareWidth/2)-5, 0, 2 * Math.PI);
            ctx.fill();
          }
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
            const image = await this.getImage(path.join(__dirname,"/images/",this.board.state[i]+".png"));
            ctx.drawImage(image, this.margins.left+(x*this.squareWidth), this.margins.top+(y*this.squareHeight), this.squareWidth, this.squareHeight);
          }
        }
      }

      save(){
        return canvas.toBuffer();
      }

      async draw(moves=null){
        this.drawBackGround(moves);
        this.drawCoordinates();
        await this.drawGame(this.state);
        return this.save();
      }
    };

    module.exports = Chess;
