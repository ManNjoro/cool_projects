import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";

export default function SearchUsers() {
  const [users, setUsers] = useState([]);
  //   const [error, setError] = useState(null);
  const [search, setSearch] = useState({ username: "" });
  const { username } = useParams();
  const navigate = useNavigate();

  const getUserMessages = async () => {
    try {
      const res = await api.get(`search/${username}/`);
      setUsers(res.data);
    } catch (error) {
      console.log(error.response.data);
      Swal.fire({
        title: "User does not exist",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "middle",
      });
    }
  };

  useEffect(() => {
    getUserMessages();
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
    <div>
      <main className="content" style={{ marginTop: "150px" }}>
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
                <div className="px-4 ">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 d-flex align-items-center mt-2">
                      <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        name="username"
                      />
                      <button
                        className="ml-2 btn btn-success"
                        onClick={searchUser}
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                </div>

                {users.map((user, index) => (
                  <Link
                    key={index}
                    to={"/inbox/" + user.id}
                    className="list-group-item list-group-item-action border-0"
                  >
                    <small>
                      <div className="badge bg-success float-right text-white"></div>
                    </small>
                    <div className="d-flex align-items-start">
                      <img
                        src={user.image}
                        className="rounded-circle mr-1"
                        alt="1"
                        width={40}
                        height={40}
                      />

                      <div className="flex-grow-1 ml-3">
                        {user.full_name}

                        <div className="small">
                          <small>
                            <i className="fas fa-envelope"> Send Message</i>
                          </small>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
