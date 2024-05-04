import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";


export default function DefaultLayout() {
  return (
    <div>
        <h1>DefaultLayout</h1>
        <ProtectedRoute>

        <Outlet />
        </ProtectedRoute>
    </div>
  )
}
