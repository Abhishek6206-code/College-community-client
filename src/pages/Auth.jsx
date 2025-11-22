import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AppContext from "../context/AppContext";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, signup } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let success = false;
    if (mode === "login") {
      success = await login(form.email, form.password);
    } else {
      success = await signup(form);
    }

    setLoading(false);
    if (success) navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div
          className="bg-white shadow-sm p-4"
          style={{ width: "100%", maxWidth: "420px", borderRadius: "10px" }}
        >
          <h4 className="fw-bold text-center mb-1">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h4>
          <p className="text-muted text-center mb-4">
            {mode === "login"
              ? "Welcome back to GrafiQ"
              : "Join GrafiQ and start connecting today"}
          </p>

          <ul className="nav nav-tabs mb-4 justify-content-center">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${mode === "signup" ? "active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </li>
          </ul>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    className="form-control"
                    placeholder="e.g. CSE"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Year</label>
                  <input
                    type="text"
                    name="year"
                    className="form-control"
                    placeholder="e.g. 3rd"
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn w-100 fw-semibold ${
                mode === "login" ? "btn-primary" : "btn-warning text-dark"
              }`}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;
