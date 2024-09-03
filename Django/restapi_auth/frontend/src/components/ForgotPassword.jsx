import { useState } from "react";
import axiosInstance from '../utils/axiosInstance'
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email) {
      const res = await axiosInstance.post('/auth/password-reset/', {'email': email})
      if (res.status === 200) {
        toast.success('A link to reser your password has been sent to your email')
      }
    }
    setEmail('')
  };
  return (
    <div>
      <h2>Enter your register Email Address</h2>
      <div className="wrapper">
        <form action="" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="" id="email">
              Email Address
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="email-form"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <button className="vbtn">Send</button>
        </form>
      </div>
    </div>
  );
}
