import * as constants from './constants.mjs';

class Player {
  constructor({id, score = 0, x = null, y = null}) {
    this.id = id;
    this.score = score;
    this.x = x;
    this.y = y;
    this.height = constants.PLAYER_HEIGHT;
    this.width = constants.PLAYER_WIDTH;
    this.movement = {
      up: 0,
      down: 0,
      left: 0,
      right: 0
    };
  }

  draw(ctx, isEnemy = false) {
    console.log("Drawing player", this);
    ctx.fillStyle = isEnemy ? constants.ENEMY_COLOR : constants.PLAYER_COLOR;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.movement.up) {
      this.y -= constants.PLAYER_SPEED;
    }
    if (this.movement.down) {
      this.y += constants.PLAYER_SPEED;
    }
    if (this.movement.left) {
      this.x -= constants.PLAYER_SPEED;
    }
    if (this.movement.right) {
      this.x += constants.PLAYER_SPEED;
    }
  }

  collision(item) {
    if (
      item.x > this.x + this.width ||
      item.x + 1 + item.width < this.x ||
      item.y + 1 + item.height < this.y ||
      item.y > this.y + this.height
    ) {

      return false;
    }

    return true;
  }

  calculateRank(players = {}) {
    let rank = 1;
    for (let id in players) {
      if (id === this.id) {
        continue;
      }
      if (players[id].score > this.score) {
        rank++;
      }
    }
    return `Rank: ${rank} / ${Object.keys(players).length}`
  }
}

export default Player;
