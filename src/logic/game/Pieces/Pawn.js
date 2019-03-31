"use strict";

const Piece = require("../Piece");

class Pawn extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type="p";
  }

  move(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    let move = false;
    if( Math.abs(newCoordinate.cordLetter-this.coordinate.cordLetter) === 0 &&
        newField === null){
      var row = (this.team === "w") ? 6 : 1;
      var moveOk = (this.team === "b") ? newCoordinate.cordNumber>this.coordinate.cordNumber : this.coordinate.cordNumber>newCoordinate.cordNumber;

      if(moveOk){
        if(this.coordinate.cordNumber == row && Math.abs(newCoordinate.cordNumber-this.coordinate.cordNumber)<=2){
          move = true;
        } else if(Math.abs(newCoordinate.cordNumber-this.coordinate.cordNumber)<=1){
          move = true;
        }
      }
    } else if(newField != null && newField.team != "" && Math.abs(newCoordinate.cordLetter-this.coordinate.cordLetter) === 1){
      if( (this.team == "w" && this.coordinate.cordNumber-newCoordinate.cordNumber == 1) ||
          (this.team == "b" && newCoordinate.cordNumber-this.coordinate.cordNumber == 1)){
        move = true
      }
    }
    return move;
  }

  print(){
    if((this.team=="w" && this.coordinate.cordNumber == "1") || (this.team=="b" && this.coordinate.cordNumber == "8")){
      this.type="q";
    }
    return this.team+this.type;
  }
}

module.exports = Pawn;
