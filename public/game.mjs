import {
  BG_COLOR,
  STATUS_BAR_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  STATUS_BAR_HEIGHT,
} from "./constants.mjs";
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById("game-window");
const ctx = canvas.getContext("2d");
const players = {};
let localId;

/**
 * Initialize the game
 */
function initialize() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  socket.on("start-game", handleStartGame);
  socket.on("new-player", handleNewPlayer);
  socket.on("remove-player", handleRemovePlayer);
};

/**
 * Set up and start the game
 * @param {Object} data 
 */
function handleStartGame(data) {
    console.log("Connected to server");
    const player1 = new Player({
        id: socket.id
    });
    socket.emit('add-player', player1);

    for (let key in data.players) {
        const player = data.players[key];
        players[player.id] = new Player(player);
    }
    players[socket.id] = player1;
    localId = socket.id;
    console.log("my player id:", localId);
    
    document.addEventListener('keydown', keydown);

    drawScreen();
}

/**
 * Add a new player to the game
 * @param {Player} player 
 */
function handleNewPlayer(player) {
    console.log("new player joined", player);
    players[player.id] = new Player(player);
}

/**
 * Remove a player from the game
 * @param {String} playerId 
 */
function handleRemovePlayer(playerId) {
    console.log("player left", playerId);
    delete players[playerId];
}

/**
 * Handle keydown events
 * @param {Event} e 
 */
function keydown(e) {
    console.log(e.keyCode);
}

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

    // const thisPlayer = players.find((player) => player.id === localId);
    // ctx.fillText(
    //   thisPlayer.calculateRank(players),
    //   (gameConstants.CANVAS_WIDTH / 6) * 5,
    //   35
    // );

    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("Coin Race", CANVAS_WIDTH / 2, 30);
}

// hold on to your butts...
initialize();