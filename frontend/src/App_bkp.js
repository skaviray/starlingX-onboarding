import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";

const API_BASE = "http://localhost:8080";

const log = (message, data = null) => {
  console.log(`[LOG] ${message}`);
  if (data) console.log("Response:", data);
};

axios.defaults.withCredentials = true; // Enable CORS support

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    log(`Attempting login for user: ${username}`);
    axios.post(`${API_BASE}/users/login`, { username, password }, { withCredentials: true })
      .then((response) => {
        log("Login successful", response.data);
        localStorage.setItem("access_token", response.data.access_token);
        navigate("/dashboard");
      })
      .catch((error) => {
        log("Login failed", error.response ? error.response.data : error.message);
        alert("Login failed");
      });
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h2 className="card-title">Login</h2>
        <h5 className="card-subtitle mb-3 text-muted">Enter your credentials</h5>
        <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ height: "100vh", width: "250px" }}>
      <h4>Dashboard</h4>
      <button className="btn btn-link" onClick={() => navigate("/sites")}>Sites</button>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2>Welcome to the Dashboard</h2>
      </div>
    </div>
  );
};

const Sites = () => {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    log("Fetching sites");
    axios.get(`${API_BASE}/sites`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    }).then((res) => {
      log("Sites fetched successfully", res.data);
      setSites(res.data);
    });
  }, []);

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h2 className="card-title">Sites</h2>
        <h5 className="card-subtitle mb-3 text-muted">Manage sites</h5>
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site, index) => (
              <tr key={index}>
                <td>{site.Id}</td>
                <td>{site.Name}</td>
                <td>{new Date(site.CreatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sites" element={<Sites />} />
      </Routes>
    </Router>
  );
};

export default App;