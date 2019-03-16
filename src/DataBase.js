"use strict";

/**
  This currently does nothing
**/
const mysql = require("mysql"),
      fs = require("fs"),
      {config} = require("./Configuration.js");

class DataBase {
  constructor(config,enabled=true){
    this.connection=null;
    this.enabled = enabled;
    this.printErrors=true;
    this.options = config;
    this.id=DataBase.databases.length;
    DataBase.databases.push(this);
  }

  setEnabled(bool){
    this.enabled=bool;
    if(bool === false){
      DataBase.databases = DataBase.databases.filter((db) => db.id !== this.id);
    }
  }

  onError(err){
    console.error(err,4);
    if(err.code === "PROTOCOL_CONNECTION_LOST") {
      this.setEnabled(false);
    } else {
      console.error(err);
    }
  }

  connect(resolve,reject,err){
    if (err) {
      if(this.printErrors){
        console.log(err,4);
      }
      this.connection=null;
      this.setEnabled(false);
      resolve(false);
    } else{
      console.log(this.options.host+" connected!",0.5);
      resolve(true);
    }
  }

  async startConnection(resolve,reject){
    console.log("connecting...");
    this.connection.connect((err) => {
      this.connect(resolve,reject,err);
    });
    this.connection.on("error", (err) => {
      this.onError(err);
    });
  }

  async start(){
    if(this.enabled){
      console.log("Loading "+this.options.host+" database");
      this.connection=mysql.createConnection(this.options);
      return await new Promise((resolve,reject) => {
        this.startConnection(resolve,reject);
      });
    }
  }

  close() {
    return new Promise((resolve,reject) => {
      this.connection.end((err) => {
        (err) ? reject(err) : resolve();
      });
    });
  }

  async query(sql,object){
    console.log(this.options.host+"("+this.options.database+")"+": "+sql,0.5);
    let response;
    try {
      response = await new Promise((resolve,reject ) => {
        this.connection.query(sql,object,(err,rows) => {
          (err) ? reject(err) : resolve(rows);
        });
      });
    } catch(e){
      if(this.printErrors){
        console.log(sql,4);
        console.log(object,4);
        console.log(e,4);
      }
      response = null;
    }
    return response;
  }

  static async loadDataBases(databaseConfig){
    const enabled = config("database","enabled"),
          options = config("database","options");
    if(enabled === true){
      for(let dc in options){
        console.time();
        let tempDb = new DataBase(options[dc]);
        console.time();
        await tempDb.start();
        console.time();
      }
    }
  }

  static async executeQuerys(sql,object){
    let result = null,
        length = DataBase.databases.length;
    for(let d = 0; d<length; d++){
      let db = DataBase.databases[d];
      if(db !== null && db.enabled === true && db.connection !== null){
        (result === null) ? result = await db.query(sql,object) : db.query(sql,object);
      }
    }
    return result;
  }
}

DataBase.enabled=true;
DataBase.databases=[];

exports.dbQuery = async function(sql,object){
  return (DataBase.enabled === true && DataBase.databases.length > 0) ? await DataBase.executeQuerys(sql,object) : null;
};

exports.dbChangeEnable = async function (bool="true"){
  console.time();
  let boolValue = bool === "true";
  console.log("Database enabled: "+boolValue);
  DataBase.enabled = boolValue;
  if(boolValue === true){
    DataBase.loadDataBases();
    console.log("Finished loading databases");
  }
};
