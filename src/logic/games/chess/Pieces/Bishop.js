"use strict";

const Piece = require("../Piece");

class Bishop extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type="b";
  }

  move(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    let direction = "";
    if(newCoordinate.cordLetter<this.coordinate.cordLetter && newCoordinate.cordNumber<this.coordinate.cordNumber){
      direction="diagonalLU";
    } else if(newCoordinate.cordLetter>this.coordinate.cordLetter && newCoordinate.cordNumber<this.coordinate.cordNumber){
      direction="diagonalRU";
    } else if(newCoordinate.cordLetter<this.coordinate.cordLetter && newCoordinate.cordNumber>this.coordinate.cordNumber){
      direction="diagonalLD";
    } else if(newCoordinate.cordLetter>this.coordinate.cordLetter && newCoordinate.cordNumber>this.coordinate.cordNumber){
      direction="diagonalRD";
    }
    if(direction !== ""){
      return board.clearPath(this,direction,newCoordinate);
    } else {
      return false;
    }
  }
}
module.exports = Bishop;
