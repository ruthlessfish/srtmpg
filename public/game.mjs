import {
  BG_COLOR,
  STATUS_BAR_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  STATUS_BAR_HEIGHT,
} from "./constants.mjs";
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import controls from './controls.mjs';
import { createPlayer, createCoin } from './utils.mjs';

const socket = io();
const canvas = document.getElementById("game-window");
const ctx = canvas.getContext("2d");

let gameFrame = 0;
let players = {};
let localId = '';
let activeCoin;

/**
 * Initialize the game
 */
function initialize() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  socket.on("start-game", data => {
    console.log("Connected to server");
    const player1 = createPlayer(socket.id);
    socket.emit('add-player', player1);

    for (let key in data.players) {
        const player = data.players[key];
        players[player.id] = new Player(player);
    }
    players[socket.id] = player1;
    localId = socket.id;
    console.log("my player id:", localId);
    activeCoin = createCoin();

    socket.on("new-player", player => {
        console.log("new player joined", player);
        players[player.id] = new Player(player);
    });
    
    socket.on("remove-player", playerId => {
        console.log("player left", playerId);
        delete players[playerId];
    });
    
    socket.on('move-start', data => {
        const player = players[data.id];
        player.movement[data.direction] = 1;
        player.x = data.x;
        player.y = data.y;
    });

    socket.on('move-end', data => {
        const player = players[data.id];
        player.movement[data.direction] = 0;
        player.x = data.x;
        player.y = data.y;
    });

    socket.on('coin-collected', data => {
        players[data.id].score += data.value;
    });

    socket.on('new-coin', () => {
        activeCoin = createCoin();
    });

    controls(player1, socket);
    drawScreen();
  });
};

/**
 * Draw the game screen
 * @param {Object} state - The current game state
 */
function drawScreen(state) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = STATUS_BAR_COLOR;
    ctx.fillRect(0, 0, canvas.width, STATUS_BAR_HEIGHT);

    ctx.fillStyle = "white";
    ctx.font = `13px 'Press Start 2P'`;
    ctx.textAlign = "center";
    ctx.fillText("Controls: WASD", CANVAS_WIDTH / 6, 30);

    const thisPlayer = players[localId];
    ctx.fillText(
      thisPlayer.calculateRank(players),
      (CANVAS_WIDTH / 6) * 5,
      35
    );

    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("Coin Race", CANVAS_WIDTH / 2, 30);

    let keep;
    for (let key in players) {
        const player = players[key];
        player.move();
        if (player.id !== localId) {
            player.draw(ctx, true);
        } else {
            keep = player;
            if (player.collision(activeCoin)) {
                socket.emit('coin-taken', { id: player.id, value: activeCoin.value });
            }
        }
        if (keep) {
            keep.draw(ctx);
        }
    }

    activeCoin.draw(ctx);
    gameFrame++;

    requestAnimationFrame(drawScreen);
}

// hold on to your butts...
initialize();