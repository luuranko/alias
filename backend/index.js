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

socketIO.on('connection', (socket) => {
    console.log('a user connected!') 
    
    socket.on('disconnect', () => {
      console.log('a user disconnected.');
      socket.disconnect()
    });

});

app.get("/", (req, res) => {
  res.send('<h1>this is the backend</h1>')
});

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});