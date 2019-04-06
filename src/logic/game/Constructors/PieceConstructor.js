"use strict";

const Bishop = require("../Pieces/Bishop.js");
const King = require("../Pieces/King.js");
const Knight = require("../Pieces/Knight.js");
const Pawn = require("../Pieces/Pawn.js");
const Queen = require("../Pieces/Queen.js");
const Rook = require("../Pieces/Rook.js");

class PieceConstructor {
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
  if(PieceConstructor.constructors.hasOwnProperty(type)){
    const constr = PieceConstructor.constructors[type];
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
