"use strict";

const Adjacent = require("./Adjacent.js");

module.exports = class Node {
  constructor(id,object) {
    this.id=id;
    this.object = object;
    this.adjacents = {};
  }

  print(){
    let response = "Node "+this.object.username+"#"+this.object.discriminator+" ("+this.id+")\n";
    for(let n in this.adjacents){
      for(let i=0;i<this.adjacents[n].length;i++){
        response+=this.adjacents[n][i].print()+"\n";
      }
    }
    return response;
  }

  equalTo(node){
    return this.getId() === node.getId();
  }

  getId(){
    return this.id;
  }

  getObject(){
    return this.object;
  }

  getAdyacent(id){
    return (this.adjacents.hasOwnProperty(id) === true) ? this.adjacents[id] : null;
  }

  addAdyacent(target,weight){
    if(this.adjacents.hasOwnProperty(target.getId()) === false){
      this.adjacents[target.getId()]=[];
    }
    let adjacent = new Adjacent(this,target,weight);
    this.adjacents[target.getId()].push(adjacent);
  }
};
