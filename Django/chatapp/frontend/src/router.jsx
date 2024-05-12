/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Message from "./pages/Message";
import Users from "./pages/Users";
import MessageDetail from "./pages/MessageDetail";
import SearchUsers from "./pages/SearchUsers";

const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Users />,
      },
      {
        path: "/inbox",
        element: <Message />,
      },
      {
        path: "/inbox/:id",
        element: <MessageDetail />,
      },
      {
        path: "/search/:username",
        element: <SearchUsers />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <RegisterAndLogout />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
