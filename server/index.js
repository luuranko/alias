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

var peers = {}
var peerLookup = []

socketIO.on('connection', function (socket) {
  console.log(`a user connected! ${socket.id}`)
  
  if (!peerLookup.includes(socket.id)) {
    peerLookup.push(socket.id)
    console.log(peerLookup)
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
 
  // Catches offer data sent by clients, and sends it to the second node in peerLookup using signal 'request_sent'
  socket.on('offer', (data) => {
    console.log('Received offer data', data)
//    sendOffer(peerLookup[1], data)
    socket.to(peerLookup[1]).emit('request_sent', data)
  });

  socket.on('message', (msg) => {
    console.log('Message detected on server side, sender is socket', socket.id, 'with msg', msg)
    console.log('emitting message to other users')
    socket.broadcast.emit('message', msg)
  });

  // When receives a 'goP2P' signal, sends out 'startP2P' to the first two nodes in peerLookup.
  // The first node gets 'initiator: true', the second one 'initiator: false' as arguments
  socket.on('goP2P', () => {
    console.log('In Server, socket.on.goP2P')
    console.log('peerlookup[0]: ', peerLookup[0])
    console.log('peerlookup[1]:', peerLookup[1])
    socketIO.to(peerLookup[0]).emit('startP2P', true)
//    socketIO.to(peerLookup[1]).emit('startP2P', false)
  })

  socket.on('accept_request', (data) => {
    socketIO.to(socket).emit('connect_to_initiator', data)
  })
});



const sendOffer = (to, data) => {
  socketIO.to(to).emit('request_sent', data)
}

app.get("/", (req, res) => {
  res.send('<h1>this is the backend</h1>')
});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});