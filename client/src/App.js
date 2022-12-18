import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import ChatBox from './Chatbox';
import socketIO from "socket.io-client"

const socket = socketIO.connect("http://localhost:4000")

const Peer = require('simple-peer')


const App = () => {
  const [chatLog, setChatLog] = useState([])
  const [p2pIsOn, setp2pIsOn] = useState(false)
  const [receivedRequest, setReceivedRequest] = useState(false)
  const [peerA, setPeerA] = useState(null)
  const peerInstance = useRef()
  const [currentOffer, setCurrentOffer] = useState(null)
  
  console.log('peerA is:', peerA)
  console.log('currentOffer:', currentOffer)
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

    // When receives a 'startP2P' signal, 
    socket.on('startP2P', (isInitiator) => {
      console.log('In Client, statrP2p')
    // sets the local variable p2pIsOn as true. used for disabling buttons etc.      
      setp2pIsOn(true)
    
    // constructs a Peer object that symbolises the other peer node. 
    // constructing a Peer automatically fires a 'signal' + data to this client itself
    // if isInitiator is true, then data for establishing a connection is generated.
      const temp_peerA = new Peer({ initiator: isInitiator, trickle: false })
      console.log('temp_peerA is ', temp_peerA)
      
    // setting up listeners for new Peer  

    // if isInitiator is true, data for the connection offer (called data) is sent back to the server
      temp_peerA.on('signal', (data) => {
        console.log('emitting offer info to server')
        if (isInitiator) {
          socket.emit('offer', {data: data})
        }
      })

      temp_peerA.on('connect', () => {
        console.log('ConnecteCOONNEDCTED ')
      })

      temp_peerA.on('data', data => {
        console.log('Received data FROM PERA!!:)', data)
      })

      console.log('now going to set peer A for realz')
      setPeerA(temp_peerA)
    })

    socket.on('connect_to_initiator', (data) => {
      console.log('In Client, Conecting to initasotr')
      setTimeout(1000)
      peerA.signal(data)
    })

    // Listening for any connection offers from the server
    socket.on('request_sent', (data) => {
      setReceivedRequest(true)
      setCurrentOffer(data)
    })

    return () => {
      socket.off('message');
      socket.off('connect');
      socket.off('startP2P')
      socket.off('connect_to_initiator')
      socket.off('request_sent')
    }

  }, [])

  // useEffect(() => {
  //   if(p2pIsOn) {
      
  //   }
  // }, [p2pIsOn])
  
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
    socket.emit('goP2P')
  }

  const acceptP2P = () => {
    console.log('Pressed accept P2p')
    console.log('PeerA is', peerA)
    socket.emit('accept_request', currentOffer)
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
        onClick={() => acceptP2P()}
        hidden={!receivedRequest}
        >
        Accept P2P
      </button>
      <button
        onClick={destroyP2P}
        disabled={!p2pIsOn}
      >Disconnect P2P</button>
    </div>
  );
}


export default App;
