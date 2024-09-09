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
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/otp/verify/:email" element={<VerifyEmail />} />
          <Route path="/forget_password" element={<ForgotPassword />} />
          <Route path="/password-reset-confirm/:uid/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
