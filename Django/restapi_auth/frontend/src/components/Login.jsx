import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    if (!email || !password) {
      setError("Email and Password are required");
    } else {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/auth/login/",
        loginData
      );
      const response = res.data;
      console.log(response);

      setIsLoading(false);
      setError('')
      const user = {
        "email": response.email,
        "name": response.full_name
      }
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('access', JSON.stringify(response.access_token))
        localStorage.setItem('refresh', JSON.stringify(response.refresh_token))
        navigate('/profile')
        toast.success("Login successful");
        // localStorage.setItem('token', response.token)
      }
    }
  };
  return (
    <div>
      <div className="form-container">
        <div style={{ width: "100%" }} className="wrapper">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {isLoading && <p>Loading... </p>}
            {error && <p style={{ color: "red", padding: "1px" }}>{error}</p>}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                name="email"
                id="email"
                className="email-form"
                value={loginData.email}
                onChange={handleOnChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="email-form"
                value={loginData.password}
                onChange={handleOnChange}
              />
            </div>
            <input type="submit" value="Submit" className="submitButton" />
          </form>
          <h3 className="text-option">Or</h3>
          <div className="githubContainer">
            <button>Sign in with Github</button>
          </div>
          <div className="googleContainer">
            <button>Sign in with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}
