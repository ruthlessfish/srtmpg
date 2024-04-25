import params from './params.mjs';
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById("game-window");
const ctx = canvas.getContext("2d");
const players = {};

/**
 * Initialize the game
 */
function initialize() {
  canvas.width = params.canvasSize.width;
  canvas.height = params.canvasSize.height;

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
    const player1 = new Player({id: socket.id});
    socket.emit('add-player', player1);

    for (let key in data.players) {
        const player = data.players[key];
        players[player.id] = new Player(player);
    }
    players[socket.id] = player1;
    console.log("player id:", socket.id);
    
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
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// hold on to your butts...
initialize();