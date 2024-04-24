import params from './params.mjs';
import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const BG_COLOR = '#231f20';
const PLAYER_COLOR = '#f2f2f2';
const OPPONENT_COLOR = '#ff4c4c';
const COLLECTIBLE_COLOR = '#e66916';
const gameScreen = document.getElementById('game-screen');
 
const socket = io();
socket.on('init', handleInit);

const canvas = document.getElementById("game-window");
const ctx = canvas.getContext("2d");

canvas.width = params.canvasSize.width;
canvas.height = params.canvasSize.height;

function handleInit(data) {
    console.log("Connected to server");
    const player1 = new Player({id: socket.id});
    socket.emit('add-player', player1);

    const players =  {};
    for (let key in data.players) {
        const player = data.players[key];
        players[player.id] = new Player(player);
    }
    players[socket.id] = player1;
    console.log("player id:", socket.id);

    socket.on('new-player', (player) => {
        console.log("new player joined", player);
        players[player.id] = new Player(player);
    });

    socket.on('remove-player', (playerId) => {
        console.log("player left", playerId);
        delete players[playerId];
    });
    
    document.addEventListener('keydown', keydown);

    // drawScreen();
}

function keydown(e) {
    console.log(e.keyCode);
}

function drawScreen(state) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const players = state.players;

    for (let id in players) {
        const player = players[id];
        ctx.fillStyle = PLAYER_COLOR;
        ctx.fillRect(player.x, player.y, params.playerWidth, params.playerHeight);
    }
}