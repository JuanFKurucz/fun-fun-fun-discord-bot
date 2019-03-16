"use strict";
const Player = require('./Player');
const base64ToImage = require('base64-to-image');
const { createCanvas, loadImage } = require('canvas');
const width=690;
const height=690;
const canvas = createCanvas(690, 690);
const ctx = canvas.getContext('2d');

const pieces = {
  "bk":"blackKing",
  "bq":"blackQueen",
  "bn":"blackKnight",
  "bb":"blackBishop",
  "br":"blackRook",
  "bp":"blackPawn",

  "wk":"whiteKing",
  "wq":"whiteQueen",
  "wn":"whiteKnight",
  "wb":"whiteBishop",
  "wr":"whiteRook",
  "wp":"whitePawn"
};

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

  getPiece(cordLetter,cordNumber){
    const calc = cordLetter+8*cordNumber;
    const text = this.state[calc];
    const team = (text.length) ? text[0] : "";
    const type = (text.length) ? text[1] : "";
    const o = {
      text,
      team,
      type,
      calc
    };
    return o;
  }

  kingInCheck(team,sampleState){
    let kingCord = null;
    for(let s in sampleState){
      if(sampleState[s]==team+"k"){
        kingCord=[s%8,parseInt(s/8)];
      }
    }
    for(let s in sampleState){
      if(sampleState[s]!="" && sampleState[s][0] != team){
        if(this.tryMakeMove(sampleState[s],this.getCord(sampleState[s]),kingCord,sampleState)){
          return true;
          break;
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
    const coordinates = [];
    let i = 0;
    let y = 0;
    switch(direction){
      case "up":
        for(i=parseInt(from[1]);i>parseInt(to[1]);i--){
          coordinates.push(String.fromCharCode(97+parseInt(from[0]))+""+i);
        }
        break;
      case "down":
        for(i=parseInt(from[1])+1;i<=parseInt(to[1]);i++){
          coordinates.push(String.fromCharCode(97+parseInt(from[0]))+""+(i+1));
        }
        break;
      case "left":
        for(i=parseInt(from[0])-1;i>=parseInt(to[0]);i--){
          coordinates.push(String.fromCharCode(97+i)+""+(parseInt(from[1])-1));
        }
        break;
      case "right":
        for(i=parseInt(from[0])+1;i<=parseInt(to[0]);i++){
          coordinates.push(String.fromCharCode(97+i)+""+(parseInt(from[1])+1));
        }
        break;
      case "diagonalLU":
        for(i=parseInt(from[0])-1;i>=parseInt(to[0]);i--){
          coordinates.push(String.fromCharCode(97+i)+""+(parseInt(from[1])+y));
          y--;
        }
        break;
      case "diagonalLD":
        y++;
        for(i=parseInt(from[0])-1;i>=parseInt(to[0]);i--){
          y++;
          coordinates.push(String.fromCharCode(97+i)+""+(parseInt(from[1])+y));
        }
        break;
      case "diagonalRU":
        for(i=parseInt(from[0])+1;i<=parseInt(to[0]);i++){
          coordinates.push(String.fromCharCode(97+i)+""+(parseInt(from[1])+y));
          y--;
        }
        break;
      case "diagonalRD":
        y++;
        for(i=parseInt(from[0])+1;i<=parseInt(to[0]);i++){
          y++;
          coordinates.push(String.fromCharCode(97+i)+""+(parseInt(from[1])+y));
        }
        break;
    }
    return coordinates;
  }

  getCord(text){
    const cords = (text.toLowerCase()).split("");
    const cordLetter = (isNaN(cords[0])) ? parseInt(cords[0].charCodeAt(0))-97 : parseInt(cords[1].charCodeAt(0))-97;
    const cordNumber = (!isNaN(cords[0])) ? parseInt(cords[0])-1 : parseInt(cords[1])-1;
    return [cordLetter,cordNumber];
  }

  tryMakeMove(piece, from, to,state = null){
    /*
    from:[cordLetter,cordNumber]
    to:[cordLetter,cordNumber]
    */
    let useState = state;
    if(useState == null){
      useState = this.state;
    }
    const pieceData = piece.split("");
    const type = pieceData[1];
    const team = pieceData[0];
    const fieldTo = this.getPiece(to[0],to[1]);
    let move = false;
    let direction = "";
    let sampleState = [...useState];
    let path=[];

    if(fieldTo.team != this.players[this.currentTurn].color){
      switch(type){
        case "k": //done
          move = Math.abs(from[0]-to[0])<=1 && Math.abs(from[1]-to[1])<=1;
          break;
        case "q":
          if(Math.abs(from[0]-to[0])==0 && Math.abs(from[1]-to[1])!=0){
            if(from[1]>to[1]){
              direction="up";
            } else {
              direction="down";
            }
          } else if(Math.abs(from[0]-to[0])!=0 && Math.abs(from[1]-to[1])==0){
            if(from[0]>to[0]){
              direction="left";
            } else {
              direction="right";
            }
          } else if(from[0]<to[0] && from[1]<to[1]){
            direction="diagonalRD";
          } else if(from[0]>to[0] && from[1]<to[1]){
            direction="diagonalLD";
          } else if(from[0]<to[0] && from[1]>to[1]){
            direction="diagonalRU";
          } else if(from[0]>to[0] && from[1]>to[1]){
            direction="diagonalLU";
          }
          break;
        case "n": //done & tested
          if( (Math.abs(from[0]-to[0])==1 && Math.abs(from[1]-to[1])==2) ||
              (Math.abs(from[0]-to[0])==2 && Math.abs(from[1]-to[1])==1)){
                move = true;
          }
          break;
        case "b": //done & tested
          if(from[0]<to[0] && from[1]<to[1]){
            direction="diagonalRD";
          } else if(from[0]>to[0] && from[1]<to[1]){
            direction="diagonalLD";
          } else if(from[0]<to[0] && from[1]>to[1]){
            direction="diagonalRU";
          } else if(from[0]>to[0] && from[1]>to[1]){
            direction="diagonalLU";
          }
          break;
        case "r":  //done & tested
          if(Math.abs(from[0]-to[0])==0 && Math.abs(from[1]-to[1])!=0){
            if(from[1]>to[1]){
              direction="up";
            } else {
              direction="down";
            }
          } else if(Math.abs(from[0]-to[0])!=0 && Math.abs(from[1]-to[1])==0){
            if(from[0]>to[0]){
              direction="left";
            } else {
              direction="right";
            }
          }
          break;
        case "p": //done & tested
          if(Math.abs(from[0]-to[0])==0 && fieldTo.team == ""){
            var row = (team == "w") ? 6 : 1;
            var moveOk = (team == "b") ? from[1]<to[1] : to[1]<from[1];
            if(moveOk){
              if(from[1] == row && Math.abs(from[1]-to[1])<=2){
                move = true;
              } else if(Math.abs(from[1]-to[1])<=1){
                move = true;
              }
            }
          } else if(Math.abs(from[0]-to[0])==1 && Math.abs(from[1]-to[1])==1 && fieldTo.team != ""){
            move = true;
          }
          break;
      }
    }
    if(direction!=""){
      path = this.generateCoordinates(direction,from,to);
      var pathOk = true;
      if(path.length===0){
        pathOk=false;
      } else {
        for(var i in path){
          var _cords = this.getCord(path[i]);
          var [_cordLetter,_cordNumber] = _cords;
          var _currentPiece = this.getPiece(_cordLetter,_cordNumber);
          if( (i==path.length-1 && _currentPiece.team != this.players[this.currentTurn].color) ||
              _currentPiece.text == ""
              ){

          } else {
            pathOk=false;
            break;
          }
        }
      }
      move=pathOk;
    }
    if(move){
      let resultToCord = to[0]+8*to[1];
      let resultFromCord = from[0]+8*from[1];
      sampleState[resultToCord]=piece;
      sampleState[resultFromCord]="";
      if(this.kingInCheck(this.players[this.currentTurn].color,sampleState)){
        return false;
      } else {
        if(state == null){
          this.state[resultToCord]=piece;
          this.state[resultFromCord]="";
        }
      }
    }
    return move;
  }

  async makeMove(player,coordinate,new_coordinate){
    if(player == this.currentTurn){
      const currentPlayer = this.players[player];
      if(coordinate.length==2 && new_coordinate.length==2){
        const cords = this.getCord(coordinate);
        const [cordLetter,cordNumber] = cords;
        const piece = this.getPiece(cordLetter,cordNumber);
        if(piece.text!=""){
          if(piece.team == currentPlayer.color){
            const new_cords = new_coordinate.toLowerCase().split("");
            const new_cordLetter = (isNaN(new_cords[0])) ? new_cords[0].charCodeAt(0)-97 : new_cords[1].charCodeAt(0)-97;
            const new_cordNumber = (!isNaN(new_cords[0])) ? parseInt(new_cords[0])-1 : parseInt(new_cords[1])-1;
            if(this.tryMakeMove(piece.text,[cordLetter,cordNumber],[new_cordLetter,new_cordNumber])){
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

    this.state=[
      "br","bn","bb","bq","bk","bb","bn","br",
      "bp","bp","bp","bp","bp","bp","bp","bp",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "","","","","","","","",
      "wp","wp","wp","wp","wp","wp","wp","wp",
      "wr","wn","wb","wq","wk","wb","wn","wr"
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
        const image = await this.getImage("images/"+pieces[state[i]]+".png");
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
  game.makeMove(game.currentTurn,realCords[0]+""+realCords[1]+"",realCords[2]+""+realCords[3]+"");
});

module.exports = Chess;