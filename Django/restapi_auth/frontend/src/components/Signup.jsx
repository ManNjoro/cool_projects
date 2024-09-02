import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");

  const { email, first_name, last_name, password, password2 } = formData;
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!email || !first_name || !last_name || !password || !password2) {
      setError("All fields are required");
    } else {
      console.log(formData);
      // make api call
      const res = await axios.post(
        "http://localhost:8000/api/v1/auth/register/",
        formData
      );
      const response = res.data
      console.log(response);
      
      if (res.status === 201){
        // redirect to verifyemail component
        navigate('/otp/verify')
        toast.success(response.message)
      }
      // check our response
      // server error
    }
  };
  return (
    <div>
      <div className="form-container">
        <div style={{ width: "100%" }} className="wrapper">
          <h2>Create account</h2>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red", padding: "1px" }}>{error}</p>}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                name="email"
                id="email"
                className="email-form"
                value={email}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">First Name</label>
              <input
                type="text"
                name="first_name"
                id=""
                className="email-form"
                value={first_name}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Last Name</label>
              <input
                type="text"
                name="last_name"
                id=""
                className="email-form"
                value={last_name}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Password</label>
              <input
                type="password"
                name="password"
                id=""
                className="email-form"
                value={password}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Confirm Password</label>
              <input
                type="password"
                name="password2"
                id=""
                className="email-form"
                value={password2}
                onChange={handleOnChange}
              />
            </div>
            <input type="submit" value="Submit" className="submitButton" />
          </form>
          <h3 className="text-option">Or</h3>
          <div className="githubContainer">
            <button>Sign up with Github</button>
          </div>
          <div className="googleContainer">
            <button>Sign up with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}
