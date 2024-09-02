import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const jwt_access = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    if (jwt_access === null && !user) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="container">
      <h2>Hi {user && user.name}</h2>
      <p style={{ textAlign: "center" }}>Welcome to your profile</p>
      <button className="logout-btn">Logout</button>
    </div>
  );
}
