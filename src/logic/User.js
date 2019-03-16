"use strict";

const Language = require("../Language.js");

module.exports = class User {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    this.cookies = 20000;
    this.cpm = 1;

    this.multipliers={
      "cpmMultiplier":1,
      "buildingMultiplier":1,
      "buildingCost":1
    };
    this.items={
      "building":{},
      "upgrade":{}
    };
    this.info=null;
    this.messageLang = null;

    this.lastResponse = null;
    this.shopList = null;
    this.messageBanner = false;
    this.banner = null;
    this.lastMessage = null;

    this.permission=-1;
  }

  setPermission(p){
    this.permission=p;
  }

  getPermission(){
    return this.permission;
  }

  resetResponses(){
    this.lastResponse = null;
    this.shopList = null;
  }

  async setLastResponse(message){
    this.lastResponse=message;
    if(this.messageBanner){
      this.banner=new Banner(message);
    } else if(this.shopList!==null){
      await this.shopList.setMessage(message);
    }
  }

  setLastMessage(message){
    this.lastMessage=message;
  }

  getLanguage(){
    if(this.messageLang === null){
      let id = "";
      if(this.info !== null){
        id=this.info.lastMessage.channel.id;//this.info.lastMessage.channel.member.guild.id;
      }
      return Language.getLan(id);
    } else {
      return this.messageLang;
    }
  }

  setMessageLang(lan){
    this.messageLang=lan;
  }

  emptyMessageLang(){
    this.messageLang=null;
  }

  getId(){
    return this.id;
  }

  getCookies(){
    return this.cookies;
  }

  getName(){
    return (this.info !== null) ? this.info.username : null;
  }

  getAvatar(){
    return (this.info !== null) ? "https://cdn.discordapp.com/avatars/"+this.getId()+"/"+this.info.avatar+".webp?size=128" : null;
  }

  setInfo(info){
    this.info=info;
  }

  claimCookies(){
    this.cookies += this.getTotalCps();
  }

  getTotalCps(){
    let sum=0;

    for(let i in this.items["building"]){
      sum+=(parseFloat(this.items["building"][i].getCps()))*this.multipliers["buildingMultiplier"];
    }

    return sum;
  }

  getTotalCpm(){
      return this.cpm*this.multipliers["cpmMultiplier"];
  }

  addCookie(){
    this.cookies+=this.getTotalCpm();
  }

  getItem(type,id){
    const typeName=type.toLowerCase();
    if(this.items.hasOwnProperty(typeName) === true && this.items[typeName].hasOwnProperty(id) === true){
      return this.items[typeName][id];
    }
    return null;
  }

  addItem(type,item){
    const typeName=type.toLowerCase();
    if(this.items.hasOwnProperty(typeName) === true){
      this.items[typeName][item.getId()]=item;
      return true;
    }
    return false;
  }

  removeItem(type,item){
    const typeName=type.toLowerCase();
    if(this.items.hasOwnProperty(typeName) === true && this.items[typeName].hasOwnProperty(item.getId()) === true){
      delete this.items[typeName][item.getId()];
      return true;
    }
    return false;
  }
};
