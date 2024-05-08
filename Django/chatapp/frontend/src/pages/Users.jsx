import { useEffect, useState } from "react"
import api from "../api"
import { Link } from "react-router-dom"


export default function Users() {
    const [users, setUsers] = useState([])

    const getUsers = async() =>{
        try {
            const res = await api.get('users/')
            setUsers(res.data)
        } catch (e) {
            alert(e)
        }
    }
    useEffect(()=>{
        getUsers()
        const interval = setInterval(() => getUsers(), 2000); // Fetch data every 5 seconds

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
    },[])
    console.log(users);
  return (
    <div className="users-container">
        {users.map(user=> <tr key={user.id}><td><Link to={`message/${user.id}`}>{user.username}</Link></td></tr>)}
    </div>
  )
}
