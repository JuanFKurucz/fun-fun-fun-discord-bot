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

    if(Math.abs(this.coordinate.cordLetter-newCoordinate.cordLetter)==0 && Math.abs(this.coordinate.cordNumber-newCoordinate.cordNumber)!=0){
      if(this.coordinate.cordNumber>newCoordinate.cordNumber){
        direction="up";
      } else {
        direction="down";
      }
    } else if(Math.abs(this.coordinate.cordLetter-newCoordinate.cordLetter)!=0 && Math.abs(this.coordinate.cordNumber-newCoordinate.cordNumber)==0){
      if(this.coordinate.cordLetter>newCoordinate.cordLetter){
        direction="left";
      } else {
        direction="right";
      }
    } else if(this.coordinate.cordLetter<newCoordinate.cordLetter && this.coordinate.cordNumber<newCoordinate.cordNumber){
      direction="diagonalRD";
    } else if(this.coordinate.cordLetter>newCoordinate.cordLetter && this.coordinate.cordNumber<newCoordinate.cordNumber){
      direction="diagonalLD";
    } else if(this.coordinate.cordLetter<newCoordinate.cordLetter && this.coordinate.cordNumber>newCoordinate.cordNumber){
      direction="diagonalRU";
    } else if(this.coordinate.cordLetter>newCoordinate.cordLetter && this.coordinate.cordNumber>newCoordinate.cordNumber){
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
