"use strict";

const Drawing = require("../../Drawing");
const Piece = require("../Piece");

class Rook extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type=Rook.type;
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
    if(direction !== ""){
      return board.clearPath(this,direction,newCoordinate);
    } else {
      return false;
    }
  }

  getImage(type="normal"){
    return Rook.images[type][this.team];
  }
}

Rook.type="r";

const loadImages = async () => {
  Rook.images = {
    "normal":{
      "b":await Drawing.loadImage(__dirname+"/../images/br.png"),
      "w":await Drawing.loadImage(__dirname+"/../images/wr.png"),
    }
  };
}
loadImages();

module.exports = Rook;
