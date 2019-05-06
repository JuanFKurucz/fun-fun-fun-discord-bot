"use strict";

const Drawing = require("../../Drawing");
const Piece = require("../Piece");

class Bishop extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type=Bishop.type;
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

  getImage(type="normal"){
    return Bishop.images[type][this.team];
  }
}

Bishop.type="b";
const loadImages = async () => {
  Bishop.images = {
    "normal":{
      "b":await Drawing.loadImage(__dirname+"/../images/bb.png"),
      "w":await Drawing.loadImage(__dirname+"/../images/wb.png"),
    },
    "mod":{
      "b":await Drawing.loadImage(__dirname+"/../images/m-bb.png"),
      "w":await Drawing.loadImage(__dirname+"/../images/m-wb.png"),
    },
  };
}
loadImages();


module.exports = Bishop;
