import * as constants from './constants.mjs';
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

function getRandomX() {
    return Math.floor(Math.random() * constants.PLAY_FIELD_MAX_X);
}

function getRandomY() {
    return Math.floor(Math.random() * constants.PLAY_FIELD_MAX_Y);
}

export function createPlayer(id) {
    return new Player({
      id: id,
      score: 0,
      x: getRandomX(),
      y: getRandomY()
    });
}

export function createCoin() {
    return new Collectible({
        x: getRandomX(),
        y: getRandomY(),
        value: Math.floor(Math.random() * 3) + 1
    });
}