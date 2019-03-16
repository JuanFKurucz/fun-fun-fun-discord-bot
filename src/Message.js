"use strict";

const Language = require("./Language.js"),
      RichEmbed = require("discord.js").RichEmbed;

module.exports = class Message {
  constructor(user) {
    this.owner=user;
    this.language = this.owner.getLanguage();
    this.message = new RichEmbed();
    this.message.setFooter(this.owner.getName(),this.owner.getAvatar());
  }

  parseText(text,data=[]){
    if(text.indexOf("^") !== -1){
      let splitted = text.split("^"),
          splittedLength = splitted.length,
          resultIndex=0,
          dataLength = data.length;
      for(let t=0;t<splittedLength;t++){
        let result = (resultIndex<dataLength) ? Language.get(splitted[t],this.language).format(data[resultIndex]) : Language.get(splitted[t],this.language);
        if(result !== ""){
          if(result.indexOf("^") !== -1){
            result = this.parseText(result);
          }
          splitted[t] = result;
          resultIndex++;
        }
      }
      return splitted.join("");
    } else {
      let result = Language.get(text,this.language).format(data);
      if(result.indexOf("^") !== -1){
        result = this.parseText(result);
      }
      return (result!=="") ? result : text;
    }
  }

  objectify(text,data=[]){
    let realText=text;
    if(typeof realText === "string"){
      realText = {
        text,
        data
      };
    }
    return realText;
  }

  setTitle(title,data=[]){
    let realTitle=this.objectify(title,data);
    this.message.setTitle(this.parseText(realTitle.text,realTitle.data));
  }

  setDescription(description,data=[]){
    let realDescription=this.objectify(description,data);
    this.message.setDescription(this.parseText(realDescription.text,realDescription.data));
  }

  addField(title,description){
    let realTitle=this.objectify(title),
        realDescription=this.objectify(description);
    if(realTitle.text!==""){
      this.message.addField(
        this.parseText(realTitle.text,realTitle.data),
        this.parseText(realDescription.text,realDescription.data)
      );
    }
  }

  print(){
    this.message.setTimestamp(new Date());
    return this.message;
  }
};
