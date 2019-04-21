const base64ToImage = require('base64-to-image');
const { createCanvas, loadImage, registerFont } = require('canvas');
registerFont(__dirname+'/arial.ttf', { family: 'Arial' });

class Drawing {
  constructor(width=690,height=690){
    this.width=width
    this.height=height;
    this.canvas = createCanvas(this.width, this.height);
    this.ctx = this.canvas.getContext('2d');
  }
}
Drawing.loadImage = loadImage;
module.exports = Drawing;
