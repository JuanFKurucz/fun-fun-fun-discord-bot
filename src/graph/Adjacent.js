"use strict";

module.exports = class Adjacent {
  constructor(source,target,weight) {
    this.source=source;
    this.target=target;
    this.weight=weight;
  }

  print(){
    return "Adjacent "+this.target.getObject().username+"#"+this.target.getObject().discriminator+" ("+this.target.getId()+") weight: "+this.weight;
  }

  equalTo(adyacent){
    return this.getSource().getId() === adyacent.getSource().getId() && this.getTarget().getId() === adyacent.getTarget().getId();
  }

  compareTo(adyacent){
    if(this.equalTo(adyacent)){
      return this.getWeight() - adyacent.getWeight();
    } else {
      return null;
    }
  }

  getSource(){
    return this.source;
  }

  getTarget(){
    return this.target;
  }

  getWeight(){
    return this.weight;
  }
};
