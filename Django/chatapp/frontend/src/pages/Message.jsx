import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import "../styles/bootstrap.min.css";
import "../styles/Message.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";

export default function Message() {
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

  return (
    <div>
      <main className="content" style={{ marginTop: "80px" }}>
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
            <div className="row g-0 border-right">
              {<Sidebar />}
              <div className="col-12 col-lg-7 col-xl-9">
                <div className="py-2 px-4 border-bottom d-none d-lg-block">
                  <div className="d-flex align-items-center py-1">
                    <div className="position-relative">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar3.png"
                        className="rounded-circle mr-1"
                        alt="Sharon Lessman"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="flex-grow-1 pl-3">
                      <strong>Sharon Lessman</strong>
                      <div className="text-muted small">
                        <em>Online</em>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-primary btn-lg mr-1 px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-phone feather-lg"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </button>
                      <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-video feather-lg"
                        >
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect
                            x={1}
                            y={5}
                            width={15}
                            height={14}
                            rx={2}
                            ry={2}
                          />
                        </svg>
                      </button>
                      <button className="btn btn-light border btn-lg px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-more-horizontal feather-lg"
                        >
                          <circle cx={12} cy={12} r={1} />
                          <circle cx={19} cy={12} r={1} />
                          <circle cx={5} cy={12} r={1} />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="position-relative">
                  <div className="chat-messages p-4">
                    <div className="chat-message-right pb-4">
                      <div>
                        <img
                          src="https://bootdey.com/img/Content/avatar/avatar1.png"
                          className="rounded-circle mr-1"
                          alt="Chris Wood"
                          width={40}
                          height={40}
                        />
                        <div className="text-muted small text-nowrap mt-2">
                          2:33 am
                        </div>
                      </div>
                      <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                        <div className="font-weight-bold mb-1">You</div>
                        Lorem ipsum dolor sit amet, vis erat denique in, dicunt
                        prodesset te vix.
                      </div>
                    </div>
                    <div className="chat-message-left pb-4">
                      <div>
                        <img
                          src="https://bootdey.com/img/Content/avatar/avatar3.png"
                          className="rounded-circle mr-1"
                          alt="Sharon Lessman"
                          width={40}
                          height={40}
                        />
                        <div className="text-muted small text-nowrap mt-2">
                          2:34 am
                        </div>
                      </div>
                      <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                        <div className="font-weight-bold mb-1">
                          Sharon Lessman
                        </div>
                        Sit meis deleniti eu, pri vidit meliore docendi ut, an
                        eum erat animal commodo.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-0 py-3 px-4 border-top">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message"
                    />
                    <button className="btn btn-primary">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
