"use strict";

const Main = require("./src/Main.js");
const tokenInfo = require("./token.json");

require('http').createServer().listen(3000);

require('dns').resolve('www.google.com', function(err) {
  if (err) {
     process.exit();
  }
});

var Program = new Main();
Program.start(tokenInfo["token"]);
