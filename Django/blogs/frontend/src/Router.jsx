/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import BlogDetails from "./pages/BlogDetails";
import BlogEdit from "./pages/BlogEdit";

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
        element: <Home />,
      },
      {
        path: "/blogs/:id",
        element: <BlogDetails />,
      },
      {
        path: "/blogs/edit/:id",
        element: <BlogEdit />,
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
