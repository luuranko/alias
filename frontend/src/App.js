// import { useState } from 'react';
import React, { Component } from 'react';
import './App.css';
// import Frontpage from './components/Frontpage';
// import Lobby from './components/Lobby';
import ChatBox from './Chatbox';

import socketIO from "socket.io-client"
import p2p from "socket.io-p2p"

const socket = socketIO.connect("http://localhost:4000")
const p2psocket = new p2p(socket)

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

  class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        chatLog: []
      }
    }
    

    addChat = (name, message, alert = false) => {
      this.setState({ chatLog: this.state.chatLog.concat({
        name,
        message: `${message}`,
        timestamp: `${Date.now()}`,
        alert
      })});
    }
    
    render() {
      const { chatLog } = this.state;
      return (
        <div className="App">
          <ChatBox
            chatLog={chatLog}
            onSend={(msg) => msg && this.addChat('Me', msg)}
          />
         <button onClick={goPrivate}>GO P2P</button> 
        </div>
      );
    }
  }

  const goPrivate = () => {
    console.log('going private')
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
