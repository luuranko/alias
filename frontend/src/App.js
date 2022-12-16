import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import ChatBox from './Chatbox';
import socketIO from "socket.io-client"

const socket = socketIO.connect("http://localhost:4000")

const Peer = require('simple-peer')

const App = () => {
  const [chatLog, setChatLog] = useState([])
  const [p2pIsOn, setp2pIsOn] = useState(false)
  const [peerlist, setPeerList] = useState([])
  const peerInstance = useRef()

  console.log(
    'RERENDER! Own socket id:', socket.id,
    'p2pIsOn:', p2pIsOn,
    'peerInstance:', peerInstance,
    'peerList:', peerlist
  )

  // Set up listeners HERE
  useEffect(() => {

    // When first gets connected to SERVER
    socket.on('connect', () => {
      // Sends the peer information of this web client
      const thisPeer = new Peer({ initiator: true})
      peerInstance.current = thisPeer
      socket.emit('peer', thisPeer)
    })

    // Starts P2P connection
    socket.on('startP2P', (peers) => {
      console.log('Received startP2P signal from server')
      console.log(peers)
      setp2pIsOn(true)
      const modifiedPeers = peers
      setPeerList(modifiedPeers)
      createP2PListeners()
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

  function createP2PListeners () {
    console.log('Creating P2P listeners')
  }

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
    console.log('SENDING MSG TO SERVER:', newMsg)

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
    socket.emit('goP2P')
    setp2pIsOn(true)
  }

  const destroyP2P = () => {
    console.log('destroying P2P connection')
    peerInstance.destroy()
    setp2pIsOn(false)
  }

  return (
    <div className="App">
      <ChatBox
        chatLog={chatLog}
        onSend={(msg) => msg && sendMessage(socket.id, socket.id, msg)}
      />
      <button onClick={goP2P}>GO P2P</button> 
      <button onClick={destroyP2P}>Disconnect P2P</button>
    </div>
  );
}


export default App;
