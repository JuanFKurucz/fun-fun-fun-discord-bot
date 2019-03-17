"use strict";

class Player {
  constructor(name) {
    this.name=name;
    this.team="";
  }

  assignColor(color){
    this.team=color;
  }
};

module.exports = Player;
