"use strict";

const Piece = require("../Piece");

class Knight extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type="n";
  }

  move(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    return ((newField && newField.team != this.team) || newField == null) &&
          (
            ( Math.abs(newCoordinate.cordLetter-this.coordinate.cordLetter)==1 &&
              Math.abs(newCoordinate.cordNumber-this.coordinate.cordNumber)==2
            ) ||
            (
              Math.abs(newCoordinate.cordLetter-this.coordinate.cordLetter)==2 &&
              Math.abs(newCoordinate.cordNumber-this.coordinate.cordNumber)==1
            )
          );
  }

  getImage(){
    return Knight.images[this.team];
  }
}

Knight.images = {};
module.exports = Knight;
