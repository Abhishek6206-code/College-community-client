import React, { useEffect, useState } from "react";
import axios from "axios";
import AppContext from "./AppContext";
import io from "socket.io-client";

const API_BASE = "https://college-community-api.onrender.com";
const socket = io(API_BASE);

const AppState = ({ children }) => {
  const [appState, setAppState] = useState({
    user: null,
    token: null,
    loading: true,
    clubs: [],
    events: [],
    resources: [],
    groups: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAppState((prev) => ({
        ...prev,
        user: JSON.parse(user),
        token,
        loading: false,
      }));
      fetchProfile(token);
    } else {
      setAppState((prev) => ({ ...prev, loading: false }));
    }

    fetchClubs();
    fetchEvents();
    fetchResources();
    fetchGroups();
  }, []);

  const normalizeUser = (data) => {
    return { ...data, _id: data._id || data.id };
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });
      if (res.data.token) {
        const userData = normalizeUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setAppState((prev) => ({
          ...prev,
          user: userData,
          token: res.data.token,
        }));
        return true;
      } else {
        alert(res.data.message || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
      return false;
    }
  };

  const signup = async (form) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, form);
      if (res.data.token) {
        const userData = normalizeUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setAppState((prev) => ({
          ...prev,
          user: userData,
          token: res.data.token,
        }));
        return true;
      } else {
        alert(res.data.message || "Signup failed");
        return false;
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed");
      return false;
    }
  };

  const fetchProfile = async (token = appState.token) => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/auth/profile`, {
        headers: { Auth: token },
      });
      if (res.data && (res.data._id || res.data.id)) {
        const userData = normalizeUser(res.data);
        localStorage.setItem("user", JSON.stringify(userData));
        setAppState((prev) => ({ ...prev, user: userData }));
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAppState((prev) => ({
      ...prev,
      user: null,
      token: null,
    }));
  };

  const fetchClubs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/clubs`);
      setAppState((prev) => ({ ...prev, clubs: res.data || [] }));
    } catch (err) {
      console.error("Error fetching clubs:", err);
    }
  };

  const requestToJoinClub = async (clubId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.post(
        `${API_BASE}/api/clubs/${clubId}/request`,
        {},
        { headers: { Auth: appState.token } }
      );
      alert(res.data.message);
      fetchClubs();
    } catch (err) {
      console.error("Join club request error:", err);
    }
  };

  const acceptClubRequest = async (clubId, userId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.post(
        `${API_BASE}/api/clubs/${clubId}/accept/${userId}`,
        {},
        { headers: { Auth: appState.token } }
      );
      alert(res.data.message);
      fetchClubs();
      fetchGroups();
    } catch (err) {
      console.error("Accept club request error:", err);
    }
  };

  const leaveClub = async (clubId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.post(
        `${API_BASE}/api/clubs/${clubId}/leave`,
        {},
        { headers: { Auth: appState.token } }
      );
      alert(res.data.message);
      fetchClubs();
      fetchGroups();
    } catch (err) {
      console.error("Leave club error:", err);
    }
  };

  const deleteClub = async (clubId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.delete(`${API_BASE}/api/clubs/${clubId}`, {
        headers: { Auth: appState.token },
      });
      alert(res.data.message);
      fetchClubs();
      fetchGroups();
    } catch (err) {
      console.error("Delete club error:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/events`);
      setAppState((prev) => ({ ...prev, events: res.data || [] }));
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchResources = async (filters = {}) => {
    try {
      const res = await axios.get(`${API_BASE}/api/resources`, {
        params: filters,
      });
      setAppState((prev) => ({ ...prev, resources: res.data || [] }));
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/groups`);
      setAppState((prev) => ({ ...prev, groups: res.data || [] }));
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const createGroup = async (groupData) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.post(`${API_BASE}/api/groups`, groupData, {
        headers: { Auth: appState.token },
      });
      if (res.data.group) {
        alert("Group created");
        fetchGroups();
        return true;
      } else {
        alert(res.data.message || "Failed to create group");
        return false;
      }
    } catch (err) {
      console.error("Create group error:", err);
      return false;
    }
  };

  const joinGroup = async (groupId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.post(
        `${API_BASE}/api/groups/${groupId}/join`,
        {},
        { headers: { Auth: appState.token } }
      );
      alert(res.data.message);
      fetchGroups();
    } catch (err) {
      console.error("Join group error:", err);
      alert("Failed to join group");
    }
  };

  const leaveGroup = async (groupId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.post(
        `${API_BASE}/api/groups/${groupId}/leave`,
        {},
        { headers: { Auth: appState.token } }
      );
      alert(res.data.message);
      fetchGroups();
    } catch (err) {
      console.error("Leave group error:", err);
      alert("Failed to leave group");
    }
  };

  const acceptRequest = async (groupId, userId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.post(
        `${API_BASE}/api/groups/${groupId}/accept/${userId}`,
        {},
        { headers: { Auth: appState.token } }
      );
      alert(res.data.message);
      fetchGroups();
    } catch (err) {
      console.error("Accept request error:", err);
    }
  };

  const removeMember = async (groupId, userId) => {
    if (!appState.token) return alert("Login first");
    try {
      const res = await axios.delete(
        `${API_BASE}/api/groups/${groupId}/remove/${userId}`,
        { headers: { Auth: appState.token } }
      );
      alert(res.data.message);
      fetchGroups();
    } catch (err) {
      console.error("Remove member error:", err);
    }
  };

  const fetchMessages = async (groupId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/groups/${groupId}/messages`, {
        headers: { Auth: appState.token },
      });
      return res.data;
    } catch (err) {
      console.error("Fetch messages error:", err);
      return [];
    }
  };

  const sendMessage = async (groupId, content) => {
    try {
      socket.emit("sendMessage", {
        groupId,
        senderId: appState.user._id || appState.user.id,
        content,
      });
      return {
        groupId,
        sender: { name: appState.user.name },
        content,
      };
    } catch (err) {
      console.error("Send message error:", err);
      return null;
    }
  };

  // NEW: uploadResource - sends multipart/form-data with field "file"
  const uploadResource = async (resource) => {
    if (!appState.token) {
      alert("Login first");
      return false;
    }
    try {
      const fd = new FormData();
      fd.append("title", resource.title);
      fd.append("course", resource.course);
      fd.append("year", resource.year);
      fd.append("subject", resource.subject);
      fd.append("type", resource.type || "notes");
      fd.append("file", resource.file); // server expects "file"

      const res = await axios.post(`${API_BASE}/api/resources`, fd, {
        headers: {
          Auth: appState.token,
          // do NOT set Content-Type manually
        },
      });

      if (res.data && res.data.resource) {
        fetchResources();
        return true;
      } else {
        alert(res.data.message || "Upload failed");
        return false;
      }
    } catch (err) {
      console.error("Upload resource error:", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
      return false;
    }
  };

  // NEW: deleteResource
  const deleteResource = async (resourceId) => {
    if (!appState.token) {
      alert("Login first");
      return false;
    }
    try {
      const res = await axios.delete(`${API_BASE}/api/resources/${resourceId}`, {
        headers: { Auth: appState.token },
      });
      alert(res.data.message || "Deleted");
      fetchResources();
      return true;
    } catch (err) {
      console.error("Delete resource error:", err);
      alert("Delete failed: " + (err.response?.data?.message || err.message));
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        login,
        signup,
        logout,
        fetchProfile,
        fetchClubs,
        requestToJoinClub,
        acceptClubRequest,
        leaveClub,
        deleteClub,
        fetchEvents,
        fetchResources,
        fetchGroups,
        createGroup,
        joinGroup,
        leaveGroup,
        acceptRequest,
        removeMember,
        fetchMessages,
        sendMessage,
        uploadResource,
        deleteResource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppState;
