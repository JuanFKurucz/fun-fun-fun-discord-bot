"use strict";

module.exports = class Constructor {
  constructor(oName,elements){
    this.elements=elements;
    this.objectName=oName;
  }

  getObjectName(){
    return this.objectName;
  }

  getElement(id){
    return (this.elements.hasOwnProperty(id) === true) ? this.elements[id] : null;
  }

  checkExists(id){
    return this.getElement(id) !== null;
  }

  createObject(id,info){
    //override
    console.log(id,info);
  }

  create(id){
    return (this.checkExists(id) === true) ? this.createObject(id,this.getElement(id)) : null;
  }
};
