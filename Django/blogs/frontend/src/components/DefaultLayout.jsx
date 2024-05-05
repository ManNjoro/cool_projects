import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar";
import { useStateContext } from "../contexts/ContextProvider";

export default function DefaultLayout() {
  const {notification} = useStateContext()
  return (
    <div>
      <Navbar />
      <ProtectedRoute>
        <Outlet />
        {notification && <div className="notification">{notification}</div>}
      </ProtectedRoute>
    </div>
  );
}
