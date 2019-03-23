"use strict";

const Coordinate = require("./Coordinate");
const PieceConstructor = require("./Constructors/PieceConstructor");

class Board {
  constructor(state){
    this.state = state;
  }

  getCord(text){
    return new Coordinate(text);
  }

  getPiece(coordinate){
    const text = this.state[coordinate.index];
    const team = (text.length) ? text[0] : "";
    const type = (text.length) ? text[1] : "";
    return PieceConstructor.create(type,team,coordinate);
  }

  kingInCheck(team,state){
    let kingCord = null;
    for(let s in state){
      if(state[s]==team+"k"){
        kingCord=[s%8,parseInt(s/8)];
      }
    }
    if(kingCord){
      for(let a in Coordinate.all){
        const cord = this.getCord(Coordinate.all[a]);
        const piece = this.getPiece(state,cord);
        if(piece.text!="" && piece.text[0] != team){
          if(this.tryMakeMove(state,piece,this.getCord(Coordinate.all[a]),kingCord)){
            return true;
            break;
          }
        }
      }
    }
    return false;
  }

  generateCoordinates(direction,from,to){
    /*
    from:[cordLetter,cordNumber]
    to:[cordLetter,cordNumber]
    */
    const coordinates = {};
    let i = 0;
    let y = 0;

    let number="";
    let letter="";
    switch(direction){
      case "up":
        for(i=parseInt(from.cordNumber);i>parseInt(to.cordNumber);i--){
          number = i;
          letter = String.fromCharCode(97+parseInt(from.cordLetter));
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "down":
        for(i=parseInt(from.cordNumber)+1;i<=parseInt(to.cordNumber);i++){
          number = i+1;
          letter = String.fromCharCode(97+parseInt(from.cordLetter));
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "left":
        for(i=parseInt(from.cordLetter)-1;i>=parseInt(to.cordLetter);i--){
          number = parseInt(from.cordNumber)-1;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "right":
        for(i=parseInt(from.cordLetter)+1;i<=parseInt(to.cordLetter);i++){
          number = parseInt(from.cordNumber)+1;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "diagonalLU":
        for(i=parseInt(from.cordLetter)-1;i>=parseInt(to.cordLetter);i--){
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
          y--;
        }
        break;
      case "diagonalLD":
        y++;
        for(i=parseInt(from.cordLetter)-1;i>=parseInt(to.cordLetter);i--){
          y++;
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "diagonalRU":
        for(i=parseInt(from.cordLetter)+1;i<=parseInt(to.cordLetter);i++){
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
          y--;
        }
        break;
      case "diagonalRD":
        y++;
        for(i=parseInt(from.cordLetter)+1;i<=parseInt(to.cordLetter);i++){
          y++;
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
    }
    return coordinates;
  }

  clearPath(direction,from,to){
    const path = this.generateCoordinates(direction,from,to);
    var pathOk = true;
    if(path.length===0 || !path.hasOwnProperty(to.text)){
      pathOk=false;
    } else {
      for(var i in path){
        var _currentPiece = this.getPiece(state,path[i]);
        if(
          (i==path.length-1 && _currentPiece.team != currentPlayer.team) ||
          _currentPiece.text == "" ){

        } else {
          pathOk=false;
          break;
        }
      }
    }
    return pathOk;
  }

  possibleMoves(piece){
    const possibleMoves = [];
    for(let a in Board.coordinates){
      const cord = this.getCord(Board.coordinates[a]);
      const fieldTo = this.getPiece(cord);
      if(piece.move(cord,fieldTo)){
        possibleMoves.push(Board.coordinates[a]);
      }
    }
    return possibleMoves;
  }
}

Board.startState = [
  "br","bn","bb","bq","bk","bb","bn","br",
  "bp","bp","bp","bp","bp","bp","bp","bp",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "wp","wp","wp","wp","wp","wp","wp","wp",
  "wr","wn","wb","wq","wk","wb","wn","wr"
];

Board.coordinates = [
  "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8",
  "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8",
  "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8",
  "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8",
  "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8",
  "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8",
  "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8",
  "h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"
];

module.exports = Board;
