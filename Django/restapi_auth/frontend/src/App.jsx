import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {
  ForgotPassword,
  Login,
  Profile,
  Signup,
  VerifyEmail,
} from "./components";

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/otp/verify" element={<VerifyEmail />} />
          <Route path="/forget_password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
