import React, { useState } from "react";
import logo from "../icon.svg";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";
import { Icon, SvgIcon } from "@mui/material";

export default function Navbar() {
  const [authState, setAuthState] = useState(AuthContext);

  const clearSession = () => {
    sessionStorage.removeItem("token");
    setAuthState(false);
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <Icon>
              <img src={logo} height={25} width={25} />
            </Icon>
            Groupomania
          </a>
          <ul className="navbar-nav">
            {!authState ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Inscription
                  </Link>
                </li>
              </>
            ) : (
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
