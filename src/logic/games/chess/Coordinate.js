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
  "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
  "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
  "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
  "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
  "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
  "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
  "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
  "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"
];

Coordinate.fromNumberToText = function(cordLetter,cordNumber){
  return String.fromCharCode(97+parseInt(cordLetter))+""+cordNumber;
}
module.exports = Coordinate;
