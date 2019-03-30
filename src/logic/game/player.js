"use strict";

class Player {
  constructor(name) {
    this.name=name;
    this.team="";
  }

  assignColor(color){
    this.team=color;
  }

  mention(){
    return "<@"+this.name+">";
  }

  printTeam(){
    return (this.team == "w") ? "white" : "black";
  }

  opponent(){
    return (this.team == "w") ? "b" : "w";
  }
};

module.exports = Player;
