"use strict";
const path = require("path");
const Drawing = require('./../Drawing');
const Player = require('./Player');

class Brute {
  constructor(id=null,state = null, movements = null) {
    this.drawing = new Drawing();
    this.id = id;
    this.playing=false;
    this.squareWidth = 80;
    this.squareHeight = 80;
    this.squareColors = ["#FECEA0","#D18B47"];
    this.margins = {
      top:25,
      left:25
    };
    if(state === null){
      this.board=new Board(this,JSON.parse(JSON.stringify(Board.startState)),[]);
    } else {
      this.board=new Board(this,state,movements);
    }
    this.currentTurn=0;
  } 

  draw(){
    return this.drawing.save();
  }
};

module.exports = Chess;
