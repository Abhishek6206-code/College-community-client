
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImage from "../assets/hero.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <section
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          height: "90vh",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          marginTop: "56px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
          }}
        ></div>
        <div className="container" style={{ zIndex: 2 }}>
          <h1 className="fw-bold display-2 mb-3">GrafiQ</h1>
          <p className="lead mb-4">
            Connect. Collaborate. Create.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-warning fw-semibold px-4"
              onClick={() => navigate("/events")}
            >
              Explore Events
            </button>
            <button
              className="btn btn-outline-light fw-semibold px-4"
              onClick={() => navigate("/clubs")}
            >
              View Clubs
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
