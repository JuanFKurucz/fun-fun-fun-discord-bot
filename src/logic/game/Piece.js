"use strict";

class Piece {
  constructor(state,coordinate) {
    this.text = state[coordinate.index];
    this.team = (this.text.length) ? this.text[0] : "";
    this.type = (this.text.length) ? this.text[1] : "";
    this.coordinate=coordinate;
    this.directions = {};
  }
  calcPath(to){ //to = Piece
    const path = [];
    let restX = this.coordinate.cordLetter - to.coordinate.cordLetter;
    let restY = this.coordinate.cordNumber - to.coordinate.cordNumber;

    const directions = Piece.directions[this.type];

    let times;

    if(directions.hasOwnProperty("diagonal")){
      times = 0;
      while ( (times == 0 || times<directions["diagonal"]) && restX!== 0 && restY !==0) {
        if(restX > 0 && restY > 0){
          restX--;
          restY--;
        } else if(restX > 0 && restY < 0){
          restX--;
          restY++;
        } else if(restX < 0 && restY > 0){
          restX++;
          restY--;
        } else if(restX < 0 && restY < 0){
          restX++;
          restY++;
        } else {
          break;
        }
        path.push(Coordinate.fromNumberToText(restX,restY));
        times++;
      }
    }

    if(directions.hasOwnProperty("up")){
      times = 0;
      while ( (times == 0 || times<directions["up"]) && restX!== 0 && restY !==0) {
        if(restX==0){
          if(restY>0){
            restY--;
          } else{
            restY++;
          }
        } else if(restY==0){
          if(restX>0){
            restX--;
          } else{
            restX++;
          }
        } else {
          break;
        }
        path.push(Coordinate.fromNumberToText(restX,restY));
        times++;
      }
    }
  }
};
Piece.directions = {
  "k":{
    "diagonal":1,
    "up":1,
    "down":1,
    "left":1,
    "right":1
  },
  "q":{
    "diagonal":0,
    "up":0,
    "down":0,
    "left":0,
    "right":0
  },
  "n":{
    "jump":0,
  },
  "b":{
    "diagonal":0,
  },
  "r":{
    "up":0,
    "down":0,
    "left":0,
    "right":0
  },
  "p":{
    "up":1
  }
}
Piece.all = {
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
module.exports = Piece;
