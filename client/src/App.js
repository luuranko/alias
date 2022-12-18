import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import ChatBox from './Chatbox';
import socketIO from "socket.io-client"

const socket = socketIO.connect("http://localhost:4000")

const Peer = require('simple-peer')


const App = () => {
  const [chatLog, setChatLog] = useState([])
  const [p2pIsOn, setp2pIsOn] = useState(false)
  const peerInstance = useRef()
  
  // Set up listeners HERE
  useEffect(() => {

    // When first gets connected to SERVER
    socket.on('connect', () => {
      console.log('socket connected to server')
    })


    // Receives message delivered via SERVER
    socket.on('message', (msg) => {
      console.log(`${socket.id} received message ${msg}`)
      setChatLog((chatLog)=>[...chatLog, msg])
    });

    return () => {
      socket.off('message');
      socket.off('connect');
      socket.off('startP2P')
    }

  }, [])

  useEffect(() => {
    if(p2pIsOn) {
      const peer0 = new Peer({ initiator: true, trickle: false })
      peer0.on('signal', (data) => {
        console.log('p0 signaled! data: ', data)
        console.log('emitting peer info to server')
        socket.emit('peer', {user: socket.id, data: data})
      })
    }
  }, [p2pIsOn])
  
  // Checks whether to send msg to server or peers
  function sendMessage (name, id, message) {
    console.log('about to send:', name, message)

    const newMsg = {
      name: name, 
      senderId: id,
      message: message, 
      timestamp: Date.now()
    }

    if (p2pIsOn) {
      sendToPeers(newMsg)
    } else {
      sendToServer(newMsg)
    }
  }

  function sendToServer(newMsg) {
    socket.emit('message', newMsg)
    setChatLog(chatLog.concat(newMsg))
  }

  function sendToPeers(newMsg) {
    console.log('SENDING MSG TO PEERS:', newMsg)
    // MAGIC TBA

    setChatLog(chatLog.concat(newMsg))
  }

  // This will start a P2P connection
  // by telling the server to start it for EVERYONE
  const goP2P = () => {
    console.log('going private')
//    socket.emit('goP2P')
    setp2pIsOn(true)
  }

  const destroyP2P = () => {
    console.log('destroying P2P connection')
    
    setp2pIsOn(false)
  }
  

  return (
    <div className="App">
      <ChatBox
        chatLog={chatLog}
        onSend={(msg) => msg && sendMessage(socket.id, socket.id, msg)}
      />
      <button
        onClick={goP2P}
        disabled={p2pIsOn}
      >GO P2P</button> 
      <button
        onClick={destroyP2P}
        disabled={!p2pIsOn}
      >Disconnect P2P</button>
    </div>
  );
}


export default App;
