import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AppContext from "../context/AppContext";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://college-community-api.onrender.com");

const Groups = () => {
  const {
    appState,
    fetchGroups,
    createGroup,
    joinGroup,
    removeMember,
    fetchMessages,
    sendMessage,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("browse");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    type: "public",
  });

  const currentUserId = appState.user?._id || appState.user?.id;

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup && isMember(selectedGroup)) {
      socket.emit("joinGroupChat", selectedGroup._id);
      loadMessages(selectedGroup._id);
    }
  }, [selectedGroup]);

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.groupId === selectedGroup?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("newMessage");
  }, [selectedGroup]);

  const loadMessages = async (groupId) => {
    const data = await fetchMessages(groupId);
    setMessages(data);
  };

  const handleSendMessage = () => {
    if (message.trim() === "" || !selectedGroup) return;
    sendMessage(selectedGroup._id, message);
    setMessage("");
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const success = await createGroup(newGroup);
    if (success) {
      setNewGroup({ name: "", description: "", type: "public" });
      setActiveTab("my");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await axios.post(
        `https://college-community-api.onrender.com/api/groups/${groupId}/leave`,
        {},
        { headers: { Auth: appState.token } }
      );
      fetchGroups();
      if (selectedGroup && selectedGroup._id === groupId) {
        setSelectedGroup(null);
        setActiveTab("my");
      }
    } catch (err) {
      console.error("Leave group error:", err);
    }
  };

  const handleAcceptRequest = async (groupId, userId) => {
    try {
      await axios.post(
        `https://college-community-api.onrender.com/api/groups/${groupId}/accept/${userId}`,
        {},
        { headers: { Auth: appState.token } }
      );
      await fetchGroups();
      if (selectedGroup && selectedGroup._id === groupId) {
        const updatedGroup = appState.groups.find((g) => g._id === groupId);
        setSelectedGroup(updatedGroup || selectedGroup);
      }
    } catch (err) {
      console.error("Accept request error:", err);
    }
  };

  const isMember = (group) =>
    group.members?.some((m) => m.user?._id === currentUserId);

  const isAdmin = (group) =>
    group.members?.some(
      (m) => m.user?._id === currentUserId && m.role === "admin"
    );

  const myGroups = appState.groups.filter((g) => isMember(g));
  const browseGroups = appState.groups.filter(
    (g) => !isMember(g) && g.type === "public"
  );

  return (
    <>
      <Navbar />
      <div className="container pt-5 my-5">
        <h2 className="fw-bold mb-3">Campus Groups</h2>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "browse" ? "active" : ""}`}
              onClick={() => setActiveTab("browse")}
            >
              Browse Groups
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "my" ? "active" : ""}`}
              onClick={() => setActiveTab("my")}
            >
              My Groups
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              ➕ Create Group
            </button>
          </li>
          {selectedGroup && isMember(selectedGroup) && (
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "chat" ? "active" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                💬 Chat
              </button>
            </li>
          )}
        </ul>

        {activeTab === "browse" && (
          <div className="row g-4">
            {browseGroups.length > 0 ? (
              browseGroups.map((g) => (
                <div key={g._id} className="col-md-4 col-sm-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="fw-bold">{g.name}</h5>
                      <p className="text-muted">{g.description}</p>
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => joinGroup(g._id)}
                      >
                        Request to Join
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No groups available</p>
            )}
          </div>
        )}

        {activeTab === "my" && (
          <div className="row g-4">
            {myGroups.length > 0 ? (
              myGroups.map((g) => (
                <div key={g._id} className="col-md-4 col-sm-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="fw-bold">
                          {g.name} {g.type === "private" && "🔒"}
                        </h5>
                        <p className="text-muted">{g.description}</p>
                      </div>
                      <div>
                        <button
                          className="btn btn-dark btn-sm me-2"
                          onClick={() => {
                            setSelectedGroup(g);
                            setActiveTab("chat");
                          }}
                        >
                          Chat
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleLeaveGroup(g._id)}
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">You haven't joined any groups yet.</p>
            )}
          </div>
        )}

        {activeTab === "create" && (
          <form
            onSubmit={handleCreateGroup}
            className="card p-4 shadow-sm"
            style={{ maxWidth: "500px" }}
          >
            <h5 className="fw-bold mb-3">Create a New Group</h5>
            <div className="mb-3">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className="form-control"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={newGroup.type}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, type: e.target.value })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <button type="submit" className="btn btn-dark w-100">
              Create Group
            </button>
          </form>
        )}

        {activeTab === "chat" && selectedGroup && isMember(selectedGroup) && (
          <div className="card p-3 shadow-sm">
            <h5 className="fw-bold mb-3">{selectedGroup.name} Chat</h5>

            {isAdmin(selectedGroup) && selectedGroup.joinRequests?.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold mb-2">Join Requests</h6>
                {selectedGroup.joinRequests.map((user) => (
                  <div
                    key={user._id}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span>{user.name}</span>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        handleAcceptRequest(selectedGroup._id, user._id)
                      }
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                marginBottom: "10px",
              }}
            >
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg._id} className="mb-2">
                    <strong>{msg.sender?.name || "Unknown"}:</strong>{" "}
                    {msg.content}
                  </div>
                ))
              ) : (
                <p className="text-muted">No messages yet</p>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn btn-dark" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Groups;
