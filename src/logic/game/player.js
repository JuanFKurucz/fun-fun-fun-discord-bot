"use strict";

class Player {
  constructor(name) {
    this.name=name;
    this.team="";
  }

  assignColor(color){
    this.team=color;
  }

  opponent(){
    return (this.team == "w") ? "b" : "w";
  }
};

module.exports = Player;
