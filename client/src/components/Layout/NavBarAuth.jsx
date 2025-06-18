import React from "react";
import { Link } from "react-router-dom";

const NavBarAuth = (props) => {
  let authSection = null;

  if (props.checkLogin()) {
    authSection = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/dashboard">
            <button className="button login-button mr-2">Dashboard</button>
          </Link>
        </li>
        <li className="nav-item active mr-5">
          <Link to="/">
            <button className="button logout-button" onClick={props.onLogout}>
              Đăng Xuất
            </button>
          </Link>
        </li>
      </ul>
    );
  } else {
    authSection = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/login">
            <button className="button login-button mr-2">Đăng nhập</button>
          </Link>
        </li>
        <li className="nav-item active mr-5">
          <Link to="/registration">
            <button className="button register-button">Đăng kí</button>
          </Link>
        </li>
      </ul>
    );
  }

  return authSection;
};

export default NavBarAuth;
