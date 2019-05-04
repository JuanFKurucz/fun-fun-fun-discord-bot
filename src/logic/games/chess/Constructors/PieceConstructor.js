"use strict";

const Bishop = require("../Pieces/Bishop.js");
const King = require("../Pieces/King.js");
const Knight = require("../Pieces/Knight.js");
const Pawn = require("../Pieces/Pawn.js");
const Queen = require("../Pieces/Queen.js");
const Rook = require("../Pieces/Rook.js");

class PieceConstructor {
  constructor(){
    this.pieces = {};
  }

  async addPiece(constructor, image){
    const tempObject = new constructor(null,null);
    const pieceName = tempObject.constructor.name;
    if(!this.pieces.hasOwnProperty(pieceName)){
  //    const loadedImage = await
      this.pieces[pieceName] = constructor;
      constructor.setImage();
    }
  }
};

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
      coordinate
    );
  } else {
    return null;
  }
}

module.exports = PieceConstructor;
