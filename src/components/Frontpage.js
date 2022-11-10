import { useState } from 'react';
import '../App.css';

const JoinButton = (props) => {
  return(
    <button
      className="spin"
      onClick={props.handler}
    >
      JOIN
    </button>
  )
}

const RoomNameField = (props) => {
  return (
    <div>
      <input
        type="text"
        id='rnamefield'
        name='rnamefield'
        onChange={props.handler}
      />
    </div>
  )
}

const Frontpage = (props) => {
  const [input, setInput] = useState('')

  

  function handleJoin(roomName) {
    setInput(props.roomName)
  }

  return(
    <div>
      <p className='funy'>You are on the frontpage</p>
      <RoomNameField
        handler={props.handleRoomNameChange}
      />
      <JoinButton
        handler={handleJoin}
      />
      <p>{input}</p>
    </div>
  )
}
export default Frontpage