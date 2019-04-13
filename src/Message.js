"use strict";

const Language = require("./Language.js"),
RichEmbed = require("discord.js").RichEmbed;
const {config} = require("./Configuration.js");

module.exports = class Message {
  constructor(server,channel,user,reaction=null) {
    this.owner = user;
    this.server = server;
    this.channel = channel;
    this.language = this.owner.getLanguage();
    this.text = null;
    this.send = true;
    this.attachment = null;
    this.message = new RichEmbed();
    this.message.setFooter(this.owner.getName(),this.owner.getAvatar());
    this.reactions = reaction;
    this.reactionCallback = null;
    this.reactionFinished = false;
    this.sentMessage = null;
  }

  async putReactions(){
    await this.sentMessage.clearReactions();

    for(let r in this.reactions){
      await this.sentMessage.react(this.reactions[r]);
    }
  }

  async handleReactions(){
    const filter = (reaction, user) => {
      return this.reactions.includes(reaction.emoji.name) && user.id === this.owner.id;
    };

    this.sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(async (collected) => {
      if(!this.reactionFinished){
        this.reactionFinished=true;
        await this.reactionCallback(this,collected);
      }
    })
    .catch(async (collected) => {
      if(!this.reactionFinished){
        this.reactionFinished=true;
        await this.reactionCallback(this,false);
      }
    });

  }

  async updateSentMessage(){
    await this.setMessage(this.sentMessage);
  }

  async setSentMessage(message){
    this.sentMessage=message;
    if(this.reactions !== null){
      await this.putReactions();
      await this.handleReactions();
    }
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
    try{
      this.message.setTimestamp(new Date());
    }catch(e){

    }
    return this.message;
  }
};
