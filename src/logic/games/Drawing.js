const path = require("path");
const fs = require('fs-promise');
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

  save(){
    return this.drawing.canvas.toBuffer();
  }
}

const rreaddir = async (dir) => {
  const images = {};
  const allFiles = [];
  const files = (await fs.readdir(dir)).map(f => path.join(dir, f))
  allFiles.push(...files)
  await Promise.all(files.map(async f => (
    (await fs.stat(f)).isDirectory() && rreaddir(f, allFiles)
  )));

  for(let f in allFiles){
    images[path.basename(allFiles[f])] = await (new Promise(function(resolve,reject){
      loadImage(allFiles[f]).then((image) => {
        resolve(image);
      });
    }));
  }
  return images;
};

Drawing.loadImages = rreaddir;
module.exports = Drawing;
