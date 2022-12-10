import React, { useEffect, useState } from 'react';
import './App.css';
import ChatBox from './Chatbox';
import socketIO from "socket.io-client"

const socket = socketIO.connect("http://localhost:4000")
const p2psocket = socket

// P2P STUFF:
//import p2p from "socket.io-p2p"

// P2P STUFF:
// const p2psocket = new p2p(socket, {autoUpgrade: false})


const App = () => {
  const [chatLog, setChatLog] = useState([])

  console.log('RERENDER! Own socket id:', p2psocket.id)

  useEffect(() => {

    p2psocket.on('message', (msg) => {
      console.log(`${p2psocket.id} received message ${msg}`)
      setChatLog((chatLog)=>[...chatLog, msg])
    });

    // p2psocket.on('go-private', () => {
    //   console.log('Received go-private signal, going to upgrade')
    //   p2psocket.upgrade();
    // })

    return () => {
      p2psocket.off('message');
      // p2psocket.off('go-private')
    }

  }, [])

  function addChat(name, id, message) {
    console.log('about to send:', name, message)

    const newMsg = {
      name: name, 
      senderId: id,
      message: message, 
      timestamp: Date.now()
    }
    p2psocket.emit('message', newMsg)
    setChatLog(chatLog.concat(newMsg))
  }
  const goP2P = () => {
    console.log('going private')
  /* P2P STUFF
    p2psocket.emit('go-private', true)
    p2psocket.upgrade()
  */
  }
  return (
    <div className="App">
      <ChatBox
        chatLog={chatLog}
        onSend={(msg) => msg && addChat(p2psocket.id, p2psocket.id, msg)}
      />
      <button onClick={goP2P}>GO P2P</button> 
    </div>
  );
}


export default App;
