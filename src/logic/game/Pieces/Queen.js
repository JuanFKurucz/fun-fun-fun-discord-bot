"use strict";

const Piece = require("../Piece");

class Queen extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type="q";
  }

  move(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    let direction = "";

    if(Math.abs(from.cordLetter-to.cordLetter)==0 && Math.abs(from.cordNumber-to.cordNumber)!=0){
      if(from.cordNumber>to.cordNumber){
        direction="up";
      } else {
        direction="down";
      }
    } else if(Math.abs(from.cordLetter-to.cordLetter)!=0 && Math.abs(from.cordNumber-to.cordNumber)==0){
      if(from.cordLetter>to.cordLetter){
        direction="left";
      } else {
        direction="right";
      }
    } else if(from.cordLetter<to.cordLetter && from.cordNumber<to.cordNumber){
      direction="diagonalRD";
    } else if(from.cordLetter>to.cordLetter && from.cordNumber<to.cordNumber){
      direction="diagonalLD";
    } else if(from.cordLetter<to.cordLetter && from.cordNumber>to.cordNumber){
      direction="diagonalRU";
    } else if(from.cordLetter>to.cordLetter && from.cordNumber>to.cordNumber){
      direction="diagonalLU";
    }

    if(direction !== ""){
      return board.clearPath(direction,this.coordinate,newCoordinate);
    } else {
      return false;
    }
  }
}

module.exports = Queen;
