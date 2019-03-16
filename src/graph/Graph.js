"use strict";

const Node = require("./Node.js");

module.exports = class Graph {
  constructor(id) {
    this.id=id;
    this.nodes = {};
  }

  print(){
    let response = "";
    for(let n in this.nodes){
      response+=this.nodes[n].print()+"\n";
    }
    return response;
  }

  getId(){
    return this.id;
  }

  getNode(id){
    return (this.nodes.hasOwnProperty(id) === true) ? this.nodes[id] : null;
  }

  addNode(id,object){
    if(this.nodes.hasOwnProperty(id) === false){
      this.nodes[id]=new Node(id,object);
    }
  }
};
