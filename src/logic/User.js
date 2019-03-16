"use strict";

const Language = require("../Language.js");

module.exports = class User {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    
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

  getName(){
    return (this.info !== null) ? this.info.username : null;
  }

  getAvatar(){
    return (this.info !== null) ? "https://cdn.discordapp.com/avatars/"+this.getId()+"/"+this.info.avatar+".webp?size=128" : null;
  }

  setInfo(info){
    this.info=info;
  }
};
