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
app.use(cors())

//var clients = [] 
var peers = {}
var peerLookup = []

socketIO.on('connection', function (socket) {
  console.log(`a user connected! ${socket.id}`)
  
//  clients[socket.id] = socket
  if (!peerLookup.includes(socket.id)) {
    peerLookup.concat(socket.id)
  }

  socket.on('disconnect', () => {
    console.log('a user disconnected.');
    if (peerLookup[socket.id] !== null) {
      var index = peerLookup.indexOf(socket.id)
      peerLookup.splice(index, 1)
      delete peers[socket.id] 
    }
    socket.disconnect()
  });
  
  socket.on('peer', (info) => {
    console.log('Received peer info', info)
    if (!peerLookup.includes(info.user)) {
      peers[socket.id] = info
    }
    console.log('peers: ', peers)
  });

  socket.on('message', (msg) => {
    console.log('Message detected on server side, sender is socket', socket.id, 'with msg', msg)
    console.log('emitting message to other users')
    socket.broadcast.emit('message', msg)
  });

  // When a single node emits goP2P
  // Server emits it to every node and gives the list of peers
  /*
  socket.on('goP2P', function(data) {
    console.log('a client emitted goP2P')
    socket.broadcast.emit('startP2P', peers);
    socket.emit('startP2P', peers)
  });
  */

  socket.on('goP2P', ({ signal }) => {
    io.to(Object.keys(clients)[0]).emit('connect peer', {signal})

  })

});

app.get("/", (req, res) => {
  res.send('<h1>this is the backend</h1>')
});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});