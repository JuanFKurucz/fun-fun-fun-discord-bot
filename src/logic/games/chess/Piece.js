"use strict";

class Piece {
  constructor(team,coordinate,directions){
    this.team = team;
    this.coordinate = coordinate;
    this.directions = directions;
    this.type="";
  }

  print(){
    return this.team+this.type;
  }

  move(board,newCoordinate){
    //override
  }

};
module.exports = Piece;
