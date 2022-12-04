const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4000
const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});
// P2P STUFF:
//const p2pserver = require('socket.io-p2p-server').Server;

app.use(cors())
// P2P STUFF:
//socketIO.use(p2pserver)
var clients = []


socketIO.on('connection', function (socket) {
  console.log(`a user connected! ${socket.id}`) 
  clients[socket.id] = socket
    
  socket.on('disconnect', () => {
    console.log('a user disconnected.');
    socket.disconnect()
  });

  socket.on('message', function(data) {
    console.log('a message was sent by user', socket.id, data)
    console.log('emitting message to other users')
    socket.broadcast.emit('message', data)
  });

  socket.on('go-private', function(data) {
    console.log('a client emitted go-private')
    socket.broadcast.emit('go-private', data);
  });
});

app.get("/", (req, res) => {
  res.send('<h1>this is the backend</h1>')
});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});