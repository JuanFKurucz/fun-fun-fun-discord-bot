"use strict";

const Main = require("./src/Main.js");
const tokenInfo = require("./token.json");

require('http').createServer().listen(process.env.PORT || 5000);

var Program = new Main();
Program.start(tokenInfo["development"]);
