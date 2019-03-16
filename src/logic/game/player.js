"use strict";

class Player {
  constructor(name) {
    this.name=name;
    this.color="";
  }

  assignColor(color){
    this.color=color;
  }
};

module.exports = Player;
