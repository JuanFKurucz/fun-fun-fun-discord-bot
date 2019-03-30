"use strict";

const Piece = require("../Piece");

class King extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type="k";
  }

  move(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    let firstPosition;
    let rookCord=null;
    let rookMovementCord=null;
    if(this.team=="w" && this.coordinate.text == "e8"){
      if(newCoordinate.text == "c8"){
        rookCord = "a8";
        rookMovementCord = "d8";
      } else if(newCoordinate.text == "g8"){
        rookCord = "h8";
        rookMovementCord = "f8";
      }
    } else if(this.team=="b" && this.coordinate.text == "e1"){
      if(newCoordinate.text == "c1"){
        rookCord = "a1";
        rookMovementCord = "d1";
      } else if(newCoordinate.text == "g1"){
        rookCord = "h1";
        rookMovementCord = "f1";
      }
    }
    if(rookCord!=null){
      let rook = board.getPiece(board.getCord(rookCord));
      if(rook != null && rook.move(board,board.getCord(rookMovementCord))){
        board.move(rook,board.getCord(rookMovementCord));
        return true;
      } else {
        return false;
      }
    } else {
      return newField.team != this.team &&
             Math.abs(this.coordinate.cordLetter-newCoordinate.cordLetter)<=1 &&
             Math.abs(this.coordinate.cordNumber-newCoordinate.cordNumber)<=1;
   }
  }
}

module.exports = King;
