"use strict";

const Main = require("./src/Main.js"),
      tokenInfo = require("./token.json");

var Program = new Main();
Program.start(tokenInfo["token"]);
