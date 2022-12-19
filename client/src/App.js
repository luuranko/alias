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
  const [peerA, setPeerA] = useState('')
  const [selfPeer, setSelfPeer] = useState(null)
  const [currentOffer, setCurrentOffer] = useState('')

  console.log('offer OUTSIDE: ', currentOffer)
  console.log('peerA OUTSIDE: ', peerA)

  // Set up listeners HERE
  useEffect(() => {

    // When first gets connected to SERVER
    socket.on('connect', () => {
      console.log('socket connected to server')
    })

    // Receives message delivered via SERVER
    socket.on('message', msg => {
      console.log(`${socket.id} received message ${msg}`)
      setChatLog((chatLog)=>[...chatLog, msg])
    });

    // When receives a 'startP2P' signal, 
    socket.on('startP2P', isInitiator => {
      console.log(`I'm, ${socket.id} and startingP2P. isInitiator is ${isInitiator}`)
      // sets the local variable p2pIsOn as true. used for disabling buttons etc.      
      setp2pIsOn(true)
    
      // constructs a Peer object that symbolises the other peer node. 
      // constructing a Peer automatically fires a 'signal' + data to this client itself
      // if isInitiator is true, then data for establishing a connection is generated.
      const temp_peer = new Peer({ initiator: isInitiator, trickle: false })
      setSelfPeer(temp_peer)
      const temp_peer2 = new Peer({ initiator: false, trickle: false })
      setPeerA(temp_peer2)
    })
        
    // Listening for any connection offers from the server
    socket.on('request_sent', data => {
      console.log('arrived to request_sent!')
      setp2pIsOn(true)
      const temp_peer = new Peer({ initiator: false, trickle: false })
      console.log('temp_peer2 that was created in request_sent:', temp_peer)
      setSelfPeer(temp_peer)
      const temp_peer2 = new Peer({ initiator: true, trickle: false })
      setPeerA(temp_peer2)
      setReceivedRequest(true)
    })

    // this step is necessary to prevent creating the listeners many times
    return () => {
      socket.off('message');
      socket.off('connect');
      socket.off('startP2P')
      socket.off('request_sent')
    }

  }, [])

  // When peerA changes from null to Peer, creates listeners
  useEffect(() => {
    if (peerA && selfPeer) {
      
      selfPeer.on('signal', data => {
        console.log('selfPeer signal', data)
        setCurrentOffer(data)
        socket.emit('offer', data)
        // peerA.signal(data)

      })

      peerA.on('signal', data => {
        console.log('peerA signal', data)
        
        socket.emit('accept_request', data)
        // selfPeer.signal(data)
      })
      
      selfPeer.on('connect', () => {
        console.log('selfPeer connected')
        selfPeer.send('Hello, my jolly peer, How are you?')
      })

      selfPeer.on('data', (data) => {
        console.log('selfPeer received', data)
        peerA.send('Fine, thanks, How about you?')
      })
      
      return () => {
        selfPeer.off('signal')
        peerA.off('signal')
        selfPeer.off('connect')
        selfPeer.off('data')
      }

    }
  }, [peerA, selfPeer])
  
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

  // TODO
  function sendToPeers(newMsg) {
    console.log('SENDING MSG TO PEERS:', newMsg)
    selfPeer.send(newMsg)
    setChatLog(chatLog.concat(newMsg))
  }

  // This will start a P2P connection
  // by telling the server to start it for both nodes
  const goP2P = () => {
    socket.emit('goP2P')
  }

  const acceptP2P = () => {
    console.log('Pressed accept P2P')
    socket.emit('accept_request', currentOffer)
    setReceivedRequest(false)
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
