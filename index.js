"use strict";

const Main = require("./src/Main.js");
const tokenInfo = require("./token.json");

var Program = new Main();
Program.start(tokenInfo["token"]);
