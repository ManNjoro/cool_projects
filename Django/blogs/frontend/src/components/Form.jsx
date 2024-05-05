/* eslint-disable react/prop-types */
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { useStateContext } from "../contexts/ContextProvider";

export default function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {setNotification} = useStateContext()

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(route, { username, password });

      console.log(res.data.access);
      if (method === "login") {
        setNotification("Login successful")
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.access);
        navigate("/");
      } else {
        setNotification("Registration successful")
        navigate("/login");
      }
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };
  console.log(error);

  return (
    <div className="login-box">
      <h1>{name}</h1>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert">
            {error.detail ? (
              error.detail
            ) : (
              <>
                {Object.keys(error).map((key) => (
                  <p key={key}>
                    {key === "username"
                      ? `username - ${error[key][0]}`
                      : `password - ${error[key][0]}`}
                  </p>
                ))}
              </>
            )}
          </div>
        )}

        <div className="user-box">
          <input
            className=""
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="user-box">
          <input
            className=""
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {loading && <LoadingIndicator />}
        <button className="" type="submit">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          {name}
        </button>
      </form>
    </div>
  );
}
