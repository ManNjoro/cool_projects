import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [newPasswords, setNewPasswords] = useState({
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setNewPasswords({ ...newPasswords, [e.target.name]: e.target.value });
  };

  const data = {
    password: newPasswords.password,
    confirm_password: newPasswords.confirm_password,
    uidb64: uid,
    token: token,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.patch("/auth/set-new-password/", data);
    const result = response.data;
    if (response.status === 200) {
      navigate("/login");
      toast.success(result.message);
    }
  };
  return (
    <div>
      <div className="form-container">
        <div className="wrapper" style={{ width: "100%" }}>
          <h2>Enter Your New Password</h2>
          <form action="" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="" id="password">
                New Password
              </label>
              <input
                type="text"
                name="password"
                id="password"
                className="email-form"
                value={newPasswords.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="" id="confirm-password">
                Confirm Password
              </label>
              <input
                type="text"
                name="confirm_password"
                id="confirm-password"
                className="email-form"
                value={newPasswords.confirm_password}
                onChange={handleChange}
              />
            </div>
            <button className="vbtn" style={{cursor: 'pointer'}}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
