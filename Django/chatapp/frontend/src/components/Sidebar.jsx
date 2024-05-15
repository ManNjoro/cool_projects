import api from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { FaSearch } from "react-icons/fa";

export default function Sidebar() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState({ username: "" });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;
  const getMessages = async () => {
    try {
      const res = await api.get(`my-messages/${user_id}/`);
      setMessages(res.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(() => getMessages(), 2000); // Fetch data every 5 seconds

    // // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const searchUser = async () => {
    try {
      const res = await api.get(`search/${search.username}/`);
      console.log("searched", res.data);
      res.data && navigate(`/search/${search.username}`);
      setUsers(res.data);
    } catch (error) {
      Swal.fire({
        title:
          error.response.status === 404 ? "No user found" : error.response.data,
        icon: "error",
        toast: true,
        timer: 2000,
        position: "middle",
        timerProgressBar: true,
        showConfirmButton: false,
        showCancelButton: true,
      });
    }
  };

  return (
    <>
      <div className="col-12 col-lg-5 col-xl-3 border-right">
        <div className="px-4 d-none d-md-block">
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 d-flex align-items-center mt-2">
              <input
                type="text"
                className="form-control my-3"
                placeholder="Search user..."
                onChange={handleSearchChange}
                name="username"
              />
              <button className="ml-2 btn btn-success" onClick={searchUser}>
                <FaSearch />
              </button>
            </div>
          </div>
        {messages.map((message) => (
          <Link
            key={message.id}
            to={`/inbox/${
              message.sender === user_id ? message.receiver : message.sender
            }`}
            className="list-group-item list-group-item-action py-2"
            style={{borderBottom: "1px solid gray"}}
          >
            <div
              style={{ float: "right" }}
              className="badge bg-success float-right text-white"
            >
              {moment
                .utc(message.created_at)
                .local()
                .startOf("seconds")
                .fromNow()}
            </div>
            <div className="d-flex align-items-start">
              {message.sender !== user_id && (
                <img
                  src={message.sender_profile.image}
                  className="rounded-circle mr-1"
                  style={{ objectFit: "cover" }}
                  alt="Vanessa Tucker"
                  width={40}
                  height={40}
                />
              )}
              {message.sender === user_id && (
                <img
                  src={message.receiver_profile.image}
                  className="rounded-circle mr-1"
                  style={{ objectFit: "cover" }}
                  alt="Vanessa Tucker"
                  width={40}
                  height={40}
                />
              )}
              <div className="flex-grow-1 ml-3" style={{ marginLeft: "10px" }}>
                {message.sender !== user_id
                  ? message.sender_profile.full_name
                  : message.receiver_profile.full_name}
                <div className="small">{message.content}</div>
              </div>
            </div>
          </Link>
        ))}
        </div>
        <hr className="d-block d-lg-none mt-1 mb-0" />
      </div>
    </>
  );
}
