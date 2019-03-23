"use strict";

const Piece = require("../Piece");

class King extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type="k";
  }

  move(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    return newField.team != this.team &&
           Math.abs(this.coordinate.cordLetter-newCoordinate.cordLetter)<=1 &&
           Math.abs(this.coordinate.cordNumber-newCoordinate.cordNumber)<=1;
  }
}

module.exports = King;
