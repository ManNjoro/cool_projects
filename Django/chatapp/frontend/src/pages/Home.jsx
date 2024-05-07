import { useState } from "react"


export default function Home() {
    const [roomName, setRoomName] = useState("")
    const [username, setUsername] = useState("")
    const handleSubmit = (e) =>{
        e.preventDefault()
    }
    console.log(roomName, username);
  return (
    <div className='chat-login-container'>
        <div className="header container">
            <h1>Django Chat</h1>
        </div>
        <form onSubmit={handleSubmit} className="chat-login-details container">
            <label htmlFor="room-name">Room Name</label>
            <input type="text" placeholder="mriba" name="room-name" id="room-name" value={roomName} onChange={(e)=> setRoomName(e.target.value)}/>
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="John" name="username" id="username" value={username} onChange={(e)=> setUsername(e.target.value)}/>
            <button className='btn btn-secondary'>Enter Room</button>
        </form>
    </div>
  )
}
