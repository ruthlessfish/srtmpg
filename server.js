require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const expect = require('chai');
const cors = require('cors');
const helmet = require('helmet');

// const Collectible = require('./public/Collectible.mjs');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const { dir } = require('console');

// Prevents MIME type sniffing
app.use(helmet.noSniff()); 
// Prevents reflected XSS attacks
app.use(helmet.xssFilter());
// Sets "Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate".
app.use(helmet.noCache()); 
// Masks the X-Powered-By header to deter attacks
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" }));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const players = {};

io.on("connection", (client) => {
  console.log("Player connected", client.id);
  client.emit('start-game', { players});

  client.on('add-player', newPlayer => {
    players[client.id] = newPlayer;
    client.broadcast.emit('new-player', newPlayer);
  });

  client.on('move-start', data => {
    data.id = client.id;
    client.broadcast.emit('move-start', data);
  });

  client.on('move-end', data => {
    data.id = client.id;
    client.broadcast.emit('move-end', data);
  });

  client.on('coin-taken', data => {
    data.id = client.id;
    io.sockets.emit('coin-collected', data);
    io.sockets.emit('new-coin');
  });

  client.on("disconnect", () => {
    console.log("Player disconnected", client.id);
    delete players[client.id];
    client.broadcast.emit('remove-player', (client.id));
  });
});

module.exports = app; // For testing