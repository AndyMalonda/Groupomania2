import React, { useState } from "react";
import logo from "../icon.svg";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { AuthContext } from "../contexts/auth-context";
import { MdPostAdd, MdLogout, MdOutlineFeed } from "react-icons/md";

export default function LoggedInNav() {
  const [authState, setAuthState] = useState(AuthContext);

  const clearSession = () => {
    sessionStorage.removeItem("token");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
    console.log("déconnecté");
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
        <div className="container-fluid">
          <a className="navbar-brand" href="/login">
            <img className="App-logo" src={logo} alt="Logo" />
            Groupomania
          </a>
          <ul className="navbar-nav">
            <li className="nav-item">{authState.username}</li>
            <li className="nav-item">
              <Link to="/posts" className="nav-btn">
                <MdOutlineFeed className="nav-icon" />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/createpost" className="nav-btn">
                <MdPostAdd className="nav-icon" />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" onClick={clearSession} className="nav-btn">
                <MdLogout className="nav-icon" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
