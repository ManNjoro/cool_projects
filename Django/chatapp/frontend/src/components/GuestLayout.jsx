import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useStateContext } from "../contexts/ContextProvider";


export default function GuestLayout() {
  const {notification} = useStateContext()
  return (
    <div>
        <Navbar />
        <Outlet />
        {notification && <div className="notification">{notification}</div>}
    </div>
  )
}
