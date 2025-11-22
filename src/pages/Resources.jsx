import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AppContext from "../context/AppContext";

const Resources = () => {
    const { appState, fetchResources, uploadResource, deleteResource } = useContext(AppContext);

    const [filters, setFilters] = useState({
        course: "",
        year: "",
        subject: "",
        type: "",
    });

    const [newResource, setNewResource] = useState({
        title: "",
        course: "",
        year: "",
        subject: "",
        type: "notes",
        file: null,
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...filters, [name]: value };
        setFilters(updated);
        fetchResources(updated);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const success = await uploadResource(newResource);
        if (success) {
            setNewResource({
                title: "",
                course: "",
                year: "",
                subject: "",
                type: "notes",
                file: null,
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById("uploadResourceModal"));
            modal.hide();
        }
    };

    return (
        <>
            <Navbar />

            <section className="text-center pt-5 mt-4 mb-4">
                <div className="container">
                    <h2 className="fw-bold">Academic Resources</h2>
                    <p className="text-muted">
                        Access and share notes, question papers, and study material with your peers
                    </p>
                </div>
            </section>

            <div className="container mb-4">
                <div className="row g-2 align-items-center">
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            name="course"
                            value={filters.course}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Courses</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="BCA">BCA</option>
                            <option value="MCA">MCA</option>
                            <option value="MBA">MBA</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Years</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="4th">4th</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Subject"
                            name="subject"
                            value={filters.subject}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Types</option>
                            <option value="notes">Notes</option>
                            <option value="exam">Exam</option>
                        </select>
                    </div>
                    <div className="col-md-2 text-md-end">
                        {appState.user ? (
                            <button
                                className="btn btn-primary w-100 fw-semibold"
                                data-bs-toggle="modal"
                                data-bs-target="#uploadResourceModal"
                            >
                                + Upload
                            </button>
                        ) : (
                            <div className="text-muted small text-center">Login to upload</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container pb-5">
                {appState.resources.length > 0 ? (
                    <div className="row g-4">
                        {appState.resources.map((res) => (
                            <div className="col-lg-4 col-md-6 col-12" key={res._id}>
                                <div className="card h-100 shadow-sm d-flex flex-column">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="fw-bold mb-1">{res.title}</h5>
                                        <p className="text-muted mb-1">
                                            {res.course} • {res.year}
                                        </p>
                                        <p className="text-muted mb-1">{res.subject}</p>
                                        <span
                                            className={`badge ${res.type === "notes" ? "bg-primary" : "bg-warning text-dark"
                                                } mb-3`}
                                        >
                                            {res.type.toUpperCase()}
                                        </span>
                                        <a
                                            href={res.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-success mt-auto"
                                        >
                                            📥 Download
                                        </a>
                                        {appState.user && res.uploadedBy?._id === appState.user.id && (
                                            <button
                                                className="btn btn-sm btn-outline-danger mt-2"
                                                onClick={() => deleteResource(res._id)}
                                            >
                                                🗑 Delete
                                            </button>
                                        )}
                                    </div>
                                    <div className="card-footer bg-light text-muted small">
                                        Uploaded by {res.uploadedBy?.name || "Unknown"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted fs-5 py-5">No resources found</div>
                )}
            </div>

            <div
                className="modal fade"
                id="uploadResourceModal"
                tabIndex="-1"
                aria-labelledby="uploadResourceModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="uploadResourceModalLabel">
                                Upload Resource
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newResource.title}
                                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Course</label>
                                    <select
                                        className="form-select"
                                        value={newResource.course}
                                        onChange={(e) => setNewResource({ ...newResource, course: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="M.Tech">M.Tech</option>
                                        <option value="BCA">BCA</option>
                                        <option value="MCA">MCA</option>
                                        <option value="MBA">MBA</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Year</label>
                                    <select
                                        className="form-select"
                                        value={newResource.year}
                                        onChange={(e) => setNewResource({ ...newResource, year: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st">1st</option>
                                        <option value="2nd">2nd</option>
                                        <option value="3rd">3rd</option>
                                        <option value="4th">4th</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newResource.subject}
                                        onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Type</label>
                                    <select
                                        className="form-select"
                                        value={newResource.type}
                                        onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                                    >
                                        <option value="notes">Notes</option>
                                        <option value="exam">Exam</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">File</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        required
                                        onChange={(e) => setNewResource({ ...newResource, file: e.target.files[0] })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Resources;
