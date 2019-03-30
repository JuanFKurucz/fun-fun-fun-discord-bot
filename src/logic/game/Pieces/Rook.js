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
        direction="down";
      } else {
        direction="up";
      }
    } else if(
        Math.abs(newCoordinate.cordLetter-this.coordinate.cordLetter) !== 0 &&
        Math.abs(newCoordinate.cordNumber-this.coordinate.cordNumber) === 0
      ){
      if(newCoordinate.cordLetter>this.coordinate.cordLetter){
        direction="right";
      } else {
        direction="left";
      }
    }
    console.log(direction);
console.log(this.coordinate,newCoordinate);
    if(direction !== ""){
      return board.clearPath(direction,this.coordinate,newCoordinate);
    } else {
      return false;
    }
  }
}
module.exports = Rook;
