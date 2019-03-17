"use strict";

class Coordinate {
  constructor(text) {
    const cords = (text.toLowerCase()).split("");
    if(isNaN(cords[0])){
      this.cordLetter=parseInt(cords[0].charCodeAt(0))-97;
      this.cordNumber=parseInt(cords[1])-1;
      this.number=parseInt(cords[1]);
      this.letter=cords[0];
    } else {
      this.cordLetter=parseInt(cords[1].charCodeAt(0))-97;
      this.cordNumber=parseInt(cords[0])-1;
      this.number=parseInt(cords[0]);
      this.letter=cords[1];
    }
    this.text = this.letter+""+this.number;
    this.index = this.cordLetter+8*this.cordNumber;
  }
};
Coordinate.all = [
  "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8",
  "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8",
  "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8",
  "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8",
  "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8",
  "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8",
  "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8",
  "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"
];

Coordinate.fromNumberToText = function(cordLetter,cordNumber){
  return String.fromCharCode(97+parseInt(cordLetter))+""+cordNumber;
}
module.exports = Coordinate;
