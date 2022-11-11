import '../App.css';

const JoinButton = (props) => {
  return(
    <button
      className='pulse'
      id='joinbtn'
      name='joinbtn'
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
        type='text'
        id='rnamefield'
        name='rnamefield'
        onChange={props.handler}
      />
    </div>
  )
}

const Frontpage = (props) => {

  return(
    <div className='frontpage'>
      <h3 className='funy'>You are on the frontpage</h3>
      <RoomNameField
        handler={props.handleRoomNameInputChange}
      />
      <JoinButton
        handler={props.handleJoinBtnPress}
      />
    </div>
  )
}
export default Frontpage