import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AppContext from "../context/AppContext";

const Event = () => {
  const { appState, fetchEvents, addEvent, fetchClubs } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    clubId: "",
    place: "",
    contactInfo: "",
    image: null,
  });

  useEffect(() => {
    fetchEvents();
    fetchClubs();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const success = await addEvent(newEvent);
    if (success) {
      setNewEvent({
        title: "",
        description: "",
        date: "",
        clubId: "",
        place: "",
        contactInfo: "",
        image: null,
      });
      const modal = bootstrap.Modal.getInstance(document.getElementById("addEventModal"));
      modal.hide();
    }
  };

  const filteredEvents = appState.events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <section className="text-center pt-5 mt-4 mb-4">
        <div className="container">
          <h2 className="fw-bold">Campus Events & Activities</h2>
          <p className="text-muted">Discover upcoming and past events organized by various clubs</p>
        </div>
      </section>

      <div className="container mb-4">
        <div className="row g-2 justify-content-between align-items-center">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4 text-md-end">
            {appState.user ? (
              <button
                className="btn btn-primary fw-semibold w-100 w-md-auto"
                data-bs-toggle="modal"
                data-bs-target="#addEventModal"
              >
                + Add Event
              </button>
            ) : (
              <div className="text-muted text-end small">Login to add an event</div>
            )}
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div className="col-lg-4 col-md-6 col-12" key={event._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={event.imageUrl || "https://via.placeholder.com/400x200"}
                    className="card-img-top"
                    alt={event.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold">{event.title}</h5>
                    <p className="text-muted mb-1">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-muted mb-1">{event.clubId?.name}</p>
                    <p className="text-muted mb-3" style={{ minHeight: "60px" }}>
                      {event.description?.slice(0, 80) || "No description provided"}
                      {event.description?.length > 80 && "..."}
                    </p>
                    <p className="mb-2"><strong>📍 {event.place}</strong></p>
                    <p className="mb-2">📞 {event.contactInfo}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted fs-5">No events found</div>
          )}
        </div>
      </div>

      <div
        className="modal fade"
        id="addEventModal"
        tabIndex="-1"
        aria-labelledby="addEventModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addEventModalLabel">Add New Event</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Club</label>
                  <select
                    className="form-select"
                    value={newEvent.clubId}
                    onChange={(e) => setNewEvent({ ...newEvent, clubId: e.target.value })}
                    required
                  >
                    <option value="">Select a club</option>
                    {appState.clubs.map((club) => (
                      <option key={club._id} value={club._id}>{club.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Place</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEvent.place}
                    onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contact Info</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEvent.contactInfo}
                    onChange={(e) => setNewEvent({ ...newEvent, contactInfo: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Event Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;
