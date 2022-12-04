// import { useState } from 'react';
import React, { useState } from 'react';
import './App.css';
// import Frontpage from './components/Frontpage';
// import Lobby from './components/Lobby';
import ChatBox from './Chatbox';

import socketIO from "socket.io-client"
// P2P STUFF:
//import p2p from "socket.io-p2p"

const socket = socketIO.connect("http://localhost:4000")
const p2psocket = socket
// P2P STUFF:
// const p2psocket = new p2p(socket, {autoUpgrade: false})

/*
const App = () => {
  const [currentPage, setCurrentPage] = useState('frontpage')

  const [roomName, setRoomName] = useState('')
  const [roomNameInput, setRoomNameInput] = useState('')

  console.log(roomName)
  function handleRoomNameInputChange(event) {
    setRoomNameInput(event.target.value)
  }

  */

  const App = () => {
    const [chatLog, setChatLog] = useState([])

    const addChat = (name, message, alert = false) => {
      console.log('about to add to chat:', name, message)
      
      if (name !== 'someone') {
        console.log('this message was sent by myself. sharing my message to server.')
        p2psocket.emit('message', message)
      }

      const newMsg = {
        name, 
        message: message, 
        timestamp: Date.now()
      }
      setChatLog(chatLog.concat(newMsg))
     /*
      this.setState({ chatLog: this.state.chatLog.concat({
        name,
        message: `${message}`,
        timestamp: `${Date.now()}`,
        alert
      })});
      */
    }
   /* 
    const addToChat = (data) => {
      this.addChat(data, 'someone')
    }
    */
    return (
      <div className="App">
        <ChatBox
          chatLog={chatLog}
          onSend={(msg) => msg && addChat(p2psocket.id, msg)}
        />
      <button onClick={goP2P}>GO P2P</button> 
    </div>
    );}

  p2psocket.on('message', function(data) {
    console.log('a message was detected:', data)
//    App.addToChat(data)
    App.addChat('someone', data)
  });

  const goP2P = () => {
    console.log('going private')
  /* P2P STUFF
    p2psocket.emit('go-private', true)
    p2psocket.upgrade()
  */
  }





  /*
  // if no room name known yet, sets the room name and joins the room
  // if room name has been set,
  // then checks if the user entered the correct room name
  // and joins the room if correct. otherwise annoying alert
  function handleJoinBtnPress() {
    if (roomName === '') {
      if (roomNameInput.trim().length > 0) {
        setRoomName(roomNameInput)
        joinRoom()
      } else {
        console.log('Empty input')
      }
    } else if (roomNameInput === roomName) {
      joinRoom()
    } else {
      alert('Incorrect room name')
    }
  }

  function joinRoom() {
    setCurrentPage('lobby')
    console.log('you have joined the room ', roomName)
  }

  function returnToFrontpage() {
    setCurrentPage('frontpage')
    console.log('you have exited the room ', roomName)
  }

  if (currentPage==='frontpage') {
    return (
      <div className='App'>
        <p className='spin'>Alias :3</p>
        <Frontpage
          handleJoinBtnPress={handleJoinBtnPress}
          handleRoomNameInputChange={handleRoomNameInputChange}
        />
        <div>Room: {roomName}</div>
      </div>
    )
  } else if (currentPage === 'lobby') {
    return (
      <div className='App'>
        <p className='spin'>Alias :3</p>
        <Lobby
          roomName={roomName}
          returnToFrontpage={returnToFrontpage}
        />
        <div>Room: {roomName}</div>
      </div>
    )
  } else {
    return (
      <div className='App'>
        <p className='spin'>Alias :3</p>
        <p className='funy'>I don't know where you are</p>
        <div>Room: {roomName}</div>
      </div>
    )
  }

}
*/
export default App;
