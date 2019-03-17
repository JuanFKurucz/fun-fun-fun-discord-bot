"use strict";
const Player = require('./Player');
const Coordinate = require('./Coordinate');
const Piece = require('./Piece');
const base64ToImage = require('base64-to-image');
const { createCanvas, loadImage } = require('canvas');
const width=690;
const height=690;
const canvas = createCanvas(690, 690);
const ctx = canvas.getContext('2d');

class Chess {
  constructor() {
    this.squareWidth = 80;
    this.squareHeight = 80;
    this.squareColors = ["#FECEA0","#D18B47"];
    this.state=[];
    this.margins = {
      top:25,
      left:25
    };
    this.players=[new Player(),new Player()];
    this.currentTurn=0;
    this.start();
  }

  getPiece(state,coordinate){
    return new Piece(state,coordinate);
  }

  kingInCheck(team,state){
    let kingCord = null;
    for(let s in state){
      if(state[s]==team+"k"){
        kingCord=[s%8,parseInt(s/8)];
      }
    }
    if(kingCord){
      for(let a in Coordinate.all){
        const cord = this.getCord(Coordinate.all[a]);
        const piece = this.getPiece(state,cord);
        if(piece.text!="" && piece.text[0] != team){
          if(this.tryMakeMove(state,piece,this.getCord(Coordinate.all[a]),kingCord)){
            return true;
            break;
          }
        }
      }
    }
    return false;
  }

  generateCoordinates(direction,from,to){
    /*
    from:[cordLetter,cordNumber]
    to:[cordLetter,cordNumber]
    */
    const coordinates = {};
    let i = 0;
    let y = 0;

    let number="";
    let letter="";
    switch(direction){
      case "up":
        for(i=parseInt(from.cordNumber);i>parseInt(to.cordNumber);i--){
          number = i;
          letter = String.fromCharCode(97+parseInt(from.cordLetter));
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "down":
        for(i=parseInt(from.cordNumber)+1;i<=parseInt(to.cordNumber);i++){
          number = i+1;
          letter = String.fromCharCode(97+parseInt(from.cordLetter));
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "left":
        console.log(parseInt(from.cordLetter)-1,parseInt(to.cordLetter));
        for(i=parseInt(from.cordLetter)-1;i>=parseInt(to.cordLetter);i--){
          number = parseInt(from.cordNumber)-1;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "right":
        for(i=parseInt(from.cordLetter)+1;i<=parseInt(to.cordLetter);i++){
          number = parseInt(from.cordNumber)+1;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "diagonalLU":
        for(i=parseInt(from.cordLetter)-1;i>=parseInt(to.cordLetter);i--){
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
          y--;
        }
        break;
      case "diagonalLD":
        y++;
        for(i=parseInt(from.cordLetter)-1;i>=parseInt(to.cordLetter);i--){
          y++;
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
      case "diagonalRU":
        for(i=parseInt(from.cordLetter)+1;i<=parseInt(to.cordLetter);i++){
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
          y--;
        }
        break;
      case "diagonalRD":
        y++;
        for(i=parseInt(from.cordLetter)+1;i<=parseInt(to.cordLetter);i++){
          y++;
          number = parseInt(from.cordNumber)+y;
          letter = String.fromCharCode(97+i);
          if(i>=0&&number>=0){
            const c = new Coordinate(letter+""+number);
            coordinates[c.text]=c;
          }
        }
        break;
    }
    return coordinates;
  }

  getCord(text){
    return new Coordinate(text);
  }

  endGame(state,team){
    for(let s in state){
      if(true){

      }
    }
  }

  possibleMoves(state,piece){

    const possibleMoves = [];
    for(let a in Coordinate.all){
      const cord = this.getCord(Coordinate.all[a]);
      if(this.tryMakeMove(state,piece,cord)){
        possibleMoves.push(Coordinate.all[a]);
      }
    }
    console.log(possibleMoves);
    return possibleMoves;
  }

  tryMakeMove(state,piece,to){
    const currentPlayer = this.players[this.currentTurn];
    const fieldTo = this.getPiece(state,to);
    const from = piece.coordinate;
    let move = false;
    let direction = "";

    if(fieldTo.team != currentPlayer.team){
      switch(piece.type){
        case "k": //done
          move = Math.abs(from.cordLetter-to.cordLetter)<=1 && Math.abs(from.cordNumber-to.cordNumber)<=1;
          break;
        case "q":
          if(Math.abs(from.cordLetter-to.cordLetter)==0 && Math.abs(from.cordNumber-to.cordNumber)!=0){
            if(from.cordNumber>to.cordNumber){
              direction="up";
            } else {
              direction="down";
            }
          } else if(Math.abs(from.cordLetter-to.cordLetter)!=0 && Math.abs(from.cordNumber-to.cordNumber)==0){
            if(from.cordLetter>to.cordLetter){
              direction="left";
            } else {
              direction="right";
            }
          } else if(from.cordLetter<to.cordLetter && from.cordNumber<to.cordNumber){
            direction="diagonalRD";
          } else if(from.cordLetter>to.cordLetter && from.cordNumber<to.cordNumber){
            direction="diagonalLD";
          } else if(from.cordLetter<to.cordLetter && from.cordNumber>to.cordNumber){
            direction="diagonalRU";
          } else if(from.cordLetter>to.cordLetter && from.cordNumber>to.cordNumber){
            direction="diagonalLU";
          }
          break;
        case "n": //done & tested
          if( (Math.abs(from.cordLetter-to.cordLetter)==1 && Math.abs(from.cordNumber-to.cordNumber)==2) ||
              (Math.abs(from.cordLetter-to.cordLetter)==2 && Math.abs(from.cordNumber-to.cordNumber)==1)){
                move = true;
          }
          break;
        case "b": //done & tested
          if(from.cordLetter<to.cordLetter && from.cordNumber<to.cordNumber){
            direction="diagonalRD";
          } else if(from.cordLetter>to.cordLetter && from.cordNumber<to.cordNumber){
            direction="diagonalLD";
          } else if(from.cordLetter<to.cordLetter && from.cordNumber>to.cordNumber){
            direction="diagonalRU";
          } else if(from.cordLetter>to.cordLetter && from.cordNumber>to.cordNumber){
            direction="diagonalLU";
          }
          break;
        case "r":  //done & tested
          if(Math.abs(from.cordLetter-to.cordLetter)==0 && Math.abs(from.cordNumber-to.cordNumber)!=0){
            if(from.cordNumber>to.cordNumber){
              direction="up";
            } else {
              direction="down";
            }
          } else if(Math.abs(from.cordLetter-to.cordLetter)!=0 && Math.abs(from.cordNumber-to.cordNumber)==0){
            if(from.cordLetter>to.cordLetter){
              direction="left";
            } else {
              direction="right";
            }
          }
          break;
        case "p": //done & tested
          if(Math.abs(from.cordLetter-to.cordLetter)==0 && fieldTo.team == ""){
            var row = (team == "w") ? 6 : 1;
            var moveOk = (team == "b") ? from.cordNumber<to.cordNumber : to.cordNumber<from.cordNumber;
            if(moveOk){
              if(from.cordNumber == row && Math.abs(from.cordNumber-to.cordNumber)<=2){
                move = true;
              } else if(Math.abs(from.cordNumber-to.cordNumber)<=1){
                move = true;
              }
            }
          } else if(Math.abs(from.cordLetter-to.cordLetter)==1 && Math.abs(from.cordNumber-to.cordNumber)==1 && fieldTo.team != ""){
            move = true;
          }
          break;
      }
    }
    if(direction!=""){
      const path = this.generateCoordinates(direction,from,to);
      var pathOk = true;
      if(path.length===0 || !path.hasOwnProperty(to.text)){
        pathOk=false;
      } else {
        for(var i in path){
          var _currentPiece = this.getPiece(state,path[i]);
          if(
            (i==path.length-1 && _currentPiece.team != currentPlayer.team) ||
            _currentPiece.text == "" ){

          } else {
            pathOk=false;
            break;
          }
        }
      }
      move=pathOk;
    }
    let resultToCord = to.cordLetter+8*to.cordNumber;
    let resultFromCord = from.cordLetter+8*from.cordNumber;
    let sampleState = [...this.state];
    sampleState[resultToCord]=piece.text;
    sampleState[resultFromCord]="";
  //  if(this.kingInCheck(this.players[this.currentTurn].team,sampleState)){
    //  console.log("King in check");
    //  return false;
    //} else {
    return move;
    //}
  }

  async makeMove(player,coordinate,new_coordinate){
    if(player == this.currentTurn){
      const currentPlayer = this.players[player];
      if(coordinate.length==2 && new_coordinate.length==2){
        const cord = this.getCord(coordinate);
        const piece = this.getPiece(this.state,cord);
        if(piece.text!=""){
          if(piece.team == currentPlayer.team){
            const new_cord = this.getCord(new_coordinate.toLowerCase());
            if(this.tryMakeMove(this.state,piece,new_cord)){
              this.state[new_cord.index]=piece.text;
              this.state[cord.index]="";
              this.currentTurn++;
              this.currentTurn%=this.players.length;
              await this.draw();
              console.log("Next turn");
            } else {
              console.log("You can't make this move");
            }
          } else {
            console.log("This piece doens't belong to you");
          }
        } else {
          console.log("Empty field");
        }
      } else {
        console.log("Coordinates are wrong");
      }
    } else {
      console.log("Not your turn");
    }
  }

  async start(){
    let firstPlayer = Math.floor(Math.random() * this.players.length);
    this.players[firstPlayer].assignColor("w");
    this.currentTurn=firstPlayer;
    this.players[(firstPlayer+1)%this.players.length].assignColor("b");

    /*this.state=[
      "br","bn","bb","bq","bk","bb","bn","br",
      "bp","bp","bp","bp","bp","bp","bp","bp",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "wp","wp","wp","wp","wp","wp","wp","wp",
      "wr","wn","wb","wq","wk","wb","wn","wr"
    ];*/

    this.state=[
      "","bk","","","bq","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","wk","","","",""
    ];

    await this.draw();
  }

  drawCoordinates(){
    const letters=["a","b","c","d","e","f","g","h"];
    const numbers=[1,2,3,4,5,6,7,8];

    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    for(let l in letters){
      ctx.fillText(
        letters[l],
        parseInt(this.margins.left+this.squareWidth/2+this.squareWidth*l),
        20
      );
      ctx.fillText(
        letters[l],
        parseInt(this.margins.left+this.squareWidth/2+this.squareWidth*l),
        height-5
      );
    }
    for(let n in numbers){
      ctx.fillText(
        numbers[n],
        5,
        parseInt(this.margins.top+this.squareHeight/2+this.squareHeight*n),
      );
      ctx.fillText(
        numbers[n],
        width-20,
        parseInt(this.margins.top+this.squareHeight/2+this.squareHeight*n),
      );
    }
  }

  drawBackGround(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    let x=0;
    let y=0;
    for(let i=0;i<64;i++){
      x=i%8;
      y=parseInt(i/8);
      if(y%this.squareColors.length==0){
        ctx.fillStyle = this.squareColors[i%this.squareColors.length];
      } else {
        ctx.fillStyle = this.squareColors[((1+i)%this.squareColors.length)];
      }
      ctx.fillRect(this.margins.left+(x*this.squareWidth), this.margins.top+y*this.squareHeight, this.squareWidth, this.squareHeight);
    }
  }

  async getImage(path){
    return await (new Promise(function(resolve,reject){
      loadImage(path).then((image) => {
        resolve(image);
      });
   }));
  }

  async drawGame(state){
    let x=0;
    let y=0;
    for(let i in state){
      if(state[i]){
        x=i%8;
        y=parseInt(i/8);
        const image = await this.getImage("images/"+Piece.all[state[i]]+".png");
        ctx.drawImage(image, this.margins.left+(x*this.squareWidth), this.margins.top+(y*this.squareHeight), this.squareWidth, this.squareHeight);
        this.save();
      }
    }
  }

  save(){
    var optionalObj = {'fileName': 'game', 'type':'png'};
    base64ToImage(canvas.toDataURL(),"./",optionalObj);
  }

  async draw(){
    /* Console debugg
    let text = "";
    for(let s in this.state){
      if(s%8==0){
        text+="\n";
      }
      if(this.state[s]==""){
        text+="   ";
      } else {
        text+=this.state[s]+" ";
      }
    }
    console.log(text);
 */
    this.drawBackGround();
    this.drawCoordinates();
    await this.drawGame(this.state);
    this.save();
  }
};

const game = new Chess();

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  const message = d.toString().trim().toLowerCase();
  const realCords=[];
  for(let m in message){
    const ascii = message.charCodeAt(m);
    if((ascii>= 97 && ascii<=122) || (ascii>=49 && ascii<=57)){
      realCords.push(message[m]);
    }
  }
  if(realCords.length==2){
    const cord = game.getCord(realCords[0]+""+realCords[1]);
    const piece = game.getPiece(game.state,cord);
    if(piece.text!=""){
      game.possibleMoves(game.state,piece);
    }
  } else {
    game.makeMove(game.currentTurn,realCords[0]+""+realCords[1]+"",realCords[2]+""+realCords[3]+"");
  }
});

module.exports = Chess;
