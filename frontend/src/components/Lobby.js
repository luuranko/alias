import '../App.css';

const Lobby = (props) => {
  return (
    <div className='lobby'>
      <h3 className='funy'>
        You are in the lobby for room {props.roomName}
      </h3>
      <div>
        <button
          className='pulse'
          onClick={props.returnToFrontpage}
        >
          Go back
        </button>
      </div>
    </div>
  )
}

export default Lobby