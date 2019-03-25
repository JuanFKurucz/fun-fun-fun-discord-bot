"use strict";

const Piece = require("../Piece");

class Rook extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type="r";
  }

  move(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    let direction = "";

    if( Math.abs(newCoordinate.cordLetter-this.coordinate.cordLetter) === 0 &&
        Math.abs(newCoordinate.cordNumber-this.coordinate.cordNumber) !== 0
      ){
      if(newCoordinate.cordNumber>this.coordinate.cordNumber){
        direction="up";
      } else {
        direction="down";
      }
    } else if(
        Math.abs(newCoordinate.cordLetter-this.coordinate.cordLetter) !== 0 &&
        Math.abs(newCoordinate.cordNumber-this.coordinate.cordNumber) === 0
      ){
      if(newCoordinate.cordLetter>this.coordinate.cordLetter){
        direction="left";
      } else {
        direction="right";
      }
    }

    if(direction !== ""){
      return board.clearPath(direction,this.coordinate,newCoordinate);
    } else {
      return false;
    }
  }
}
module.exports = Rook;