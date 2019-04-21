"use strict";

/**
Levels of logs:
0-Always print no matter what, don't use this level
1-Important routines
2-Important steps trought the code
3-Whatever else

**/

const fs = require("fs"),
util = require("util"),
{ performance } = require("perf_hooks"),
{config} = require("./Configuration.js");

let LogObject = null;

module.exports = class Logger {
  static get(){
    return LogObject;
  }

  static init(level,maxTrace){
    const l = (level) ? level : config("logger","level");
    const mT = (maxTrace) ? maxTrace : config("logger","maxTrace");
    LogObject = new Logger(l,mT);
  }

  parseStackLine(line){
    return line.substring(line.indexOf("(")+1,line.indexOf(")")).replace(/^.*[\\/]/, "");
  }

  getLineNumber(){
    const obj = {};
    Error.captureStackTrace(obj, this.getLineNumber);
    let stackTrace = obj.stack.split("\n")[1];
    return this.parseStackLine(stackTrace).split(":")[1];
  }

  getFileAndLine() {
    let response = "\nTrace";
    let end = "\n";
    if(this.maxTrace===0){
      return "";
    } else if(this.maxTrace===1){
      response = "";
      end = "";
    }
    const obj = {};
    Error.captureStackTrace(obj, this.getFileAndLine);

    let stackTrace = obj.stack.split("\n");
    let tope = this.maxTrace;
    if(stackTrace.length<tope){
      tope = stackTrace.length;
    }
    let start=false;
    let count=0;
    for(let i=0;i<stackTrace.length;i++){
      let tracePath = this.parseStackLine(stackTrace[i]);
      if(start === false){
        let lineNumber = tracePath.split(":")[1];
        if(lineNumber>= this.linePrinting[0] && lineNumber <= this.linePrinting[1]){
          start=true;
        }
      } else {
        if(count>=tope){
          break;
        } else {
          response += " -> "+tracePath;
          count++;
        }
      }
    }
    return response+end;
  }

  constructor(level,maxTrace,writing=true) {
    this.linePrinting=[];
    this.fileNames={};
    this.writing=writing;
    this.level = level;
    this.maxTrace = maxTrace;
    this.outputFile = "./output/output-"+Date.now()+".txt";
    this.lastTime = performance.now();
    const self = this;

    this.linePrinting.push(this.getLineNumber());
    console.log = function() {
      self.console(arguments);
    };
    console.error = function(){
      self.console(arguments,"red");
    };
    console.time = function(){
      self.performance(arguments);
    };
    this.linePrinting.push(this.getLineNumber());
  }

  performance(){
    const time = performance.now();
    this.sendConsole(this.level,time + " Last Diff: "+(time-this.lastTime) + this.getFileAndLine(1)+"\n","yellow");
    this.lastTime=time;
  }

  sendConsole(level,text,color="white"){
    const style = config("logger","style");
    this.output(text);
    if(this.level >= level){
      process.stdout.write(style.font[color]+text);
    }
  }

  console(args,color="white"){
    let l = 3;
    if(!isNaN(args[args.length-1])){
      l = parseFloat(args[args.length-1]);
      switch(l){
        case 0.5:
        color="green";
        break;
        default:
        color="white";
        break;
      }
    }
    const r = util.format.apply(null, args),
    cute = this.parseOutput(r,l);
    this.sendConsole(l,cute,color);
  }

  getLevel(){
    return this.level;
  }

  parseOutput(message,lvl){
    const date = new Date(),
    Dd = (date.getDate()+"").padStart(2,"0"),
    Mm = ((date.getMonth()+1)+"").padStart(2,"0"),
    Yyyy = date.getFullYear(),
    hh = (date.getHours()+"").padStart(2,"0"),
    mm = (date.getMinutes()+"").padStart(2,"0"),
    ss = (date.getSeconds()+"").padStart(2,"0"),
    result = "("+lvl+") ["+Dd+"-"+Mm+"-"+Yyyy+" "+hh+":"+mm+":"+ss+"] "+message+" "+this.getFileAndLine()+"\n";

    return result;
  }

  output(message){
    if(this.writing){
      if (!fs.existsSync("./output/")) {
        fs.mkdirSync("./output/");
      }
      fs.appendFileSync(this.outputFile, message);
    }
  }
};
