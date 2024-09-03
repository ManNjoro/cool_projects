import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from 'react-toastify'

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const jwt_access = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    if (jwt_access === null && !user) {
      navigate("/login");
    } else {
      getSomeData()
    }
  }, [jwt_access, user]);

  const refresh = JSON.parse(localStorage.getItem('refresh'))

  const getSomeData = async()=> {
    const resp = await axiosInstance.get('/auth/profile/')
    if (resp.status === 200) {
      console.log(resp.data);
      
    }
  }

  const handleLogout = async() => {
    const res = await axiosInstance.post('/auth/logout/', {'refresh_token': refresh })
    if (res.status === 200) {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('user')
      navigate('/login')
      toast.success('Logout successful')
    }
  }
  return (
    <div className="container">
      <h2>Hi {user && user.name}</h2>
      <p style={{ textAlign: "center" }}>Welcome to your profile</p>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}
