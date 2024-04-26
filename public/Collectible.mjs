import { COIN_COLOR, COIN_HEIGHT, COIN_WIDTH } from "./constants.mjs";

class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.width = COIN_WIDTH;
    this.height = COIN_HEIGHT;
  }

  draw(ctx) {
    ctx.fillStyle = COIN_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
