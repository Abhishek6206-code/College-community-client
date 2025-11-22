import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Clubs = () => {
  const {
    appState,
    fetchClubs,
    requestToJoinClub,
    acceptClubRequest,
    leaveClub,
    deleteClub,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedClub, setSelectedClub] = useState(null);

  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    category: "",
    coverImage: null,
  });

  useEffect(() => {
    fetchClubs();
  }, []);

  const filteredClubs = appState.clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  const myClubs = appState.clubs.filter((club) =>
    club.members?.some((m) => m.user?._id === appState.user?._id)
  );

  const browseClubs = appState.clubs.filter(
    (club) =>
      !club.members?.some((m) => m.user?._id === appState.user?._id)
  );

  const isAdmin = (club) =>
    club.members?.some(
      (m) => m.user?._id === appState.user?._id && m.role === "admin"
    );

  const handleAccept = (clubId, userId) => {
    acceptClubRequest(clubId, userId);
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("requestsModal")
    );
    modal.hide();
  };

  const handleLeave = (clubId) => {
    if (window.confirm("Are you sure you want to leave this club?")) {
      leaveClub(clubId);
    }
  };

  const handleDelete = (clubId) => {
    if (window.confirm("Are you sure you want to delete this club?")) {
      deleteClub(clubId);
    }
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newClub.name);
    formData.append("description", newClub.description);
    formData.append("category", newClub.category);
    if (newClub.coverImage) formData.append("coverImage", newClub.coverImage);

    try {
      const res = await fetch("https://college-community-api.onrender.com/api/clubs", {
        method: "POST",
        headers: { Auth: appState.token },
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      fetchClubs();
      setNewClub({ name: "", description: "", category: "", coverImage: null });
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("addClubModal")
      );
      modal.hide();
    } catch (err) {
      console.error("Error adding club:", err);
    }
  };

  return (
    <>
      <Navbar />
      <section className="text-center pt-5 mt-4 mb-4">
        <div className="container">
          <h2 className="fw-bold">Campus Clubs & Societies</h2>
          <p className="text-muted">
            Join clubs that match your interests and connect with peers
          </p>
        </div>
      </section>

      <div className="container">
        <ul className="nav nav-tabs mb-4 justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "browse" ? "active" : ""}`}
              onClick={() => setActiveTab("browse")}
            >
              Browse Clubs
            </button>
          </li>
          {appState.user && (
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "my" ? "active" : ""}`}
                onClick={() => setActiveTab("my")}
              >
                My Clubs
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="container mb-4">
        <div className="row g-2 justify-content-between align-items-center">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search clubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4 text-md-end">
            {appState.user ? (
              <button
                className="btn btn-primary fw-semibold w-100 w-md-auto"
                data-bs-toggle="modal"
                data-bs-target="#addClubModal"
              >
                + Add Club
              </button>
            ) : (
              <div className="text-muted text-end small">
                Login to add a club
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {activeTab === "browse" &&
            (browseClubs.length > 0 ? (
              browseClubs.map((club) => (
                <div className="col-lg-4 col-md-6 col-12" key={club._id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={club.coverImage || "https://via.placeholder.com/400x200"}
                      className="card-img-top"
                      alt={club.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold">{club.name}</h5>
                      <p className="text-muted mb-2">
                        {club.category && (
                          <span className="badge bg-secondary me-2">
                            {club.category}
                          </span>
                        )}
                      </p>
                      <p className="text-muted mb-3" style={{ minHeight: "60px" }}>
                        {club.description?.slice(0, 80) || "No description"}
                        {club.description?.length > 80 && "..."}
                      </p>
                      <button
                        className="btn btn-outline-primary mt-auto"
                        onClick={() => requestToJoinClub(club._id)}
                      >
                        Request to Join
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted fs-5">No clubs found</div>
            ))}

          {activeTab === "my" &&
            (myClubs.length > 0 ? (
              myClubs.map((club) => (
                <div className="col-lg-4 col-md-6 col-12" key={club._id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={club.coverImage || "https://via.placeholder.com/400x200"}
                      className="card-img-top"
                      alt={club.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold">{club.name}</h5>
                      <p className="text-muted mb-2">
                        {club.category && (
                          <span className="badge bg-secondary me-2">
                            {club.category}
                          </span>
                        )}
                      </p>
                      <p className="text-muted mb-3" style={{ minHeight: "60px" }}>
                        {club.description?.slice(0, 80) || "No description"}
                        {club.description?.length > 80 && "..."}
                      </p>
                      <div className="mt-auto d-flex flex-wrap gap-2">
                        {isAdmin(club) && (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#requestsModal"
                            onClick={() => setSelectedClub(club)}
                          >
                            Requests
                          </button>
                        )}
                        {isAdmin(club) ? (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(club._id)}
                          >
                            Delete Club
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleLeave(club._id)}
                          >
                            Leave Club
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted fs-5">
                You haven’t joined any clubs yet.
              </div>
            ))}
        </div>
      </div>

      <div
        className="modal fade"
        id="addClubModal"
        tabIndex="-1"
        aria-labelledby="addClubModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="addClubModalLabel">
                Add New Club
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleAddClub}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Club Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newClub.name}
                    onChange={(e) =>
                      setNewClub({ ...newClub, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newClub.description}
                    onChange={(e) =>
                      setNewClub({ ...newClub, description: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newClub.category}
                    onChange={(e) =>
                      setNewClub({ ...newClub, category: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Cover Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setNewClub({ ...newClub, coverImage: e.target.files[0] })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Club
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {selectedClub && (
        <div
          className="modal fade"
          id="requestsModal"
          tabIndex="-1"
          aria-labelledby="requestsModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="requestsModalLabel">
                  Join Requests - {selectedClub.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {selectedClub.pendingRequests?.length > 0 ? (
                  selectedClub.pendingRequests.map((user) => (
                    <div
                      key={user._id}
                      className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
                    >
                      <span>{user.name}</span>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleAccept(selectedClub._id, user._id)}
                      >
                        Accept
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No pending requests</div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Clubs;
