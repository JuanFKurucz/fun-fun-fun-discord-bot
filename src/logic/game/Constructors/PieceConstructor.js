"use strict";

const Bishop = require("../Pieces/Bishop.js");
const King = require("../Pieces/King.js");
const Knight = require("../Pieces/Knight.js");
const Pawn = require("../Pieces/Pawn.js");
const Queen = require("../Pieces/Queen.js");
const Rook = require("../Pieces/Rook.js");

class PieceConstructor {

  /*
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
  }*/
};

PieceConstructor.directions = {
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
PieceConstructor.all = {
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

PieceConstructor.constructors = {
  "b":Bishop,
  "k":King,
  "n":Knight,
  "p":Pawn,
  "q":Queen,
  "r":Rook
};

PieceConstructor.create = function(type,team,coordinate){
  if(PieceConstructor.constructors.hasOwnProperty(type.toLowerCase())){
    const constr = PieceConstructor.constructors[type.toLowerCase()];
    return new constr(
      team,
      coordinate,
      PieceConstructor.directions[type.toLowerCase()]
    );
  } else {
    return null;
  }
}

module.exports = PieceConstructor;
