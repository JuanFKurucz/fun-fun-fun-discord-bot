"use strict";

const Drawing = require("../../Drawing");
const Piece = require("../Piece");

class King extends Piece {
  constructor(team,coordinate) {
    super(team,coordinate);
    this.type=King.type;
  }

  normalMove(board,newCoordinate){
    const newField = board.getPiece(newCoordinate);
    return ((newField!== null && newField.team != this.team) || newField === null) &&
    Math.abs(this.coordinate.cordLetter-newCoordinate.cordLetter)<=1 &&
    Math.abs(this.coordinate.cordNumber-newCoordinate.cordNumber)<=1;
  }

  move(board,newCoordinate){
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
      if(rook != null){
        if(rook.move(board,board.getCord(rookMovementCord))){
          board.move(rook,board.getCord(rookMovementCord));
          return true;
        } else {
          return false;
        }
      } else {
        return this.normalMove(board,newCoordinate);
      }
    } else {
      return this.normalMove(board,newCoordinate);
    }
  }
  getImage(type="normal"){
    return King.images[type][this.team];
  }
}

King.type="k";
const loadImages = async () => {
  King.images = {
    "normal":{
      "b":await Drawing.loadImage(__dirname+"/../images/bk.png"),
      "w":await Drawing.loadImage(__dirname+"/../images/wk.png"),
    },
    "mod":{
      "b":await Drawing.loadImage(__dirname+"/../images/m-bk.png"),
      "w":await Drawing.loadImage(__dirname+"/../images/m-wk.png"),
    },
  };
}
loadImages();

module.exports = King;
