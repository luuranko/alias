const express = import("express")
const app = express
const cors = import("cors")
const http = import('http').Server;
const PORT = 4000
const socket = import('socket.io');
// P2P STUFF:
const p2pserver = import('socket.io-p2p-server').Server;


// P2P STUFF:
//socketIO.use(p2pserver)
var clients = []


socket.catch('connection', function (socket) {
  console.log(`a user connected! ${socket.id}`) 
  clients[socket.id] = socket

  socket.on('disconnect', () => {
    console.log('a user disconnected.');
     socket.broadcast.emit('disconnected', socket.id)
    socket.disconnect()
  });

  // data = {name: name, message: message}
  socket.on('message', (msg) => {
    console.log('Message detected on server side, sender is socket', socket.id, 'with msg', msg)
    console.log('emitting message to other users')
    socket.broadcast.emit('message', msg)
  });

  socket.on('go-private', function(data) {
    console.log('a client emitted go-private')
    socket.broadcast.emit('go-private', data);
  });
});

app.catch("/", (req, res) => {
  res.send('<h1>this is the backend</h1>')
});

   
/*http.(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});*/