import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

const Navbar = () => {
  const { appState, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          🎓 <span className="ms-2 text-primary">Campus</span>
          <span className="text-dark">Connect</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/events">
                📅 <span className="ms-1">Events</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/clubs">
                👥 <span className="ms-1">Clubs</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/resources">
                📚 <span className="ms-1">Resources</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/groups">
                💬 <span className="ms-1">Groups</span>
              </Link>
            </li>

            {!appState.user && (
              <li className="nav-item ms-lg-3">
                <Link to="/auth" className="btn btn-primary fw-semibold px-3">
                  Sign In
                </Link>
              </li>
            )}

            {appState.user && (
              <li className="nav-item ms-lg-3">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger fw-semibold px-3"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
