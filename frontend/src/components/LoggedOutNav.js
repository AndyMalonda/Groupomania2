import React, { useContext, useState } from "react";
import logo from "../icon.svg";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { MdLogin, MdPersonAddAlt1 } from "react-icons/md";

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
              <Link to="/login" className="nav-btn">
                <MdLogin />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/registration" className="nav-btn">
                <MdPersonAddAlt1 />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
