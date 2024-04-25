import * as constants from './constants.mjs';

class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.score = score;
    this.y = y;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch(dir) {
      case 'up':
        this.y - speed >= constants.PLAY_FIELD_MIN_Y ?
          (this.y -= speed) :
          (this.y -= 0);
        break;
      case 'down':
        this.y + speed <= constants.PLAY_FIELD_MAX_Y ?
          (this.y += speed) :
          (this.y += 0);
        break;
      case 'left':
        this.x - speed >= constants.PLAY_FIELD_MIN_X ?
          (this.x -= speed) :
          (this.x -= 0);
        break;
      case 'right':
        this.x + speed <= constants.PLAY_FIELD_MAX_X ?
          (this.x += speed) :
          (this.x += 0);
        break;
    }
  }

  collision(item) {
    if (this.x < item.x + item.width &&
        this.x + constants.PLAYER_WIDTH > item.x &&
        this.y < item.y + item.height &&
        this.y + constants.PLAYER_HEIGHT > item.y) {
      this.score += item.points;
      return true;
    }
  }

  calculateRank(arr) {
    const sortedScores = arr.sort((a, b) => b.score - a.score);
    const playerRank = this.score === 0 ? 
      arr.length : 
      sortedScores.findIndex(player => player.id === this.id) + 1;

    return `Rank: ${mainPlayerRank} / ${arr.length}`;
  }
}

export default Player;
