import React from "react";
import logo from "../icon.svg";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img className="App-logo" src={logo} alt="Logo" />
            Groupomania
          </a>
          <ul className="navbar-nav">
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
          </ul>
        </div>
      </nav>
    </div>
  );
}
