import React, { useContext, useState } from "react";
import logo from "../icon.svg";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { AuthContext } from "../contexts/auth-context";

export default function Navbar() {
  const [authState, setAuthState] = useState(AuthContext);

  const clearSession = () => {
    sessionStorage.clear();
    setAuthState(false);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img className="App-logo" src={logo} alt="Logo" />
            Groupomania
          </a>
          <ul className="navbar-nav">
            {!authState && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/registration" className="nav-link">
                    Inscription
                  </Link>
                </li>
              </>
            )}
            {authState && (
              <>
                <li className="nav-item">
                  <Link to="/posts" className="nav-link">
                    Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/createpost" className="nav-link">
                    Créer un post
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" onClick={clearSession} className="nav-link">
                    Se déconnecter
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}
