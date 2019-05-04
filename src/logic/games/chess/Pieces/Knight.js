"use strict";

const Drawing = require("../../Drawing");
const Piece = require("../Piece");

class Knight extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type=Knight.type;
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

getImage(type="normal"){
  return Knight.images[type][this.team];
}
}

Knight.type="n";
const loadImages = async () => {
  Knight.images = {
    "normal":{
      "b":await Drawing.loadImage(__dirname+"/../images/bn.png"),
      "w":await Drawing.loadImage(__dirname+"/../images/wn.png"),
    }
  };
}
loadImages();
module.exports = Knight;
