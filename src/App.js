import { useState } from 'react';
import './App.css';
import Frontpage from './components/Frontpage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('frontpage')

  const [roomName, setRoomName] = useState('')

  function handleRoomNameChange(event) {
    setRoomName(event.target.value)
  }
  if (currentPage==='frontpage') {

    return (
      <div className="App">
        <p className="spin">Alias :3</p>
        <Frontpage
          handleRoomNameChange={handleRoomNameChange}
          roomName={roomName}
        />
      </div>
    );
  }

}

export default App;
