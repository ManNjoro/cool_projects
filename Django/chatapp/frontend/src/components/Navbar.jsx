import { useEffect, useState } from "react";
import "../styles/styles.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("access"));
  }, [token]);
  return (
    <div>
      <header id="header">
        <nav className="nav">
          <div className="nav-center">
            <div className="nav-header">
              <div className="logo">LOGO</div>
              <button className="nav-toggle">
                <i className="fas fa-bars"></i>
              </button>
            </div>
            <div className="links-container">
              <ul className="links">
                <li>
                  <Link to="/" className="scroll-link">
                    Home
                  </Link>
                </li>
                {!token ? (
                  <>
                    <li>
                      <Link to="/login" className="scroll-link">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="scroll-link">
                        Register
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/logout" className="scroll-link">
                      Logout
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
