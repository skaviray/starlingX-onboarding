import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash, FaPlus, FaTrash, FaEllipsisV } from "react-icons/fa";
import { Dropdown, DropdownButton } from "react-bootstrap";

const API_BASE = "http://localhost:8080";

const log = (message, data = null) => {
  console.log(`[LOG] ${message}`);
  if (data) console.log("Response:", data);
};

axios.defaults.withCredentials = true;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (e) e.preventDefault();
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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "350px" }}>
        <div className="text-center">
          <img src="/dog-avatar.png" alt="Dog Avatar" className="mb-3" style={{ width: "80px" }} />
          <h1 className="mb-4">WRCP Onboarding</h1>
        </div>
        <h2 className="card-title text-center">Login</h2>
        <h5 className="card-subtitle mb-3 text-muted text-center">Enter your credentials</h5>
        <form onSubmit={handleLogin}>
          <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <div className="input-group mb-3">
            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

const Sidebar = ({ setSelectedEntityType, onLogout }) => {
  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ height: "100vh", width: "250px", position: "relative" }}>
      <h4>Dashboard</h4>
      <hr />
      {["Sites", "Nodes", "Deployments"].map((type) => (
        <button key={type} className="btn btn-link text-primary text-start" onClick={() => setSelectedEntityType(type)}>
          {type}
        </button>
      ))}
      <hr />
      <div style={{ position: "absolute", bottom: "20px", left: "10px" }}>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [entities, setEntities] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate("/login"), 60000);
    return () => clearTimeout(timeout);
  }, []);
  
  const fetchEntities = (type) => {
    log(`Fetching ${type}`);
    axios.get(`${API_BASE}/${type.toLowerCase()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    }).then((res) => {
      log(`${type} fetched successfully`, res.data);
      setEntities(res.data || []);
      setSelectedEntityType(type);
      setSelectedEntities(new Set());
      setSelectedEntity(null);
      setCurrentPage(1);
    }).catch((error) => {
      log(`Error fetching ${type}`, error.response ? error.response.data : error.message);
    });
  };

  const toggleEntitySelection = (id) => {
    setSelectedEntities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteEntities = () => {
    log("Deleting selected entities", Array.from(selectedEntities));
    // Perform delete API call here
  };

  const handleAction = (action) => {
    log(`Performing ${action} on selected entities`, Array.from(selectedEntities));
    // Perform action API call here
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntities = entities.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="d-flex">
      <Sidebar setSelectedEntityType={fetchEntities} onLogout={() => navigate("/login")} />
      <div className="flex-grow-1 p-4">
        {selectedEntityType ? (
          <>
            <h2>{selectedEntityType}</h2>
            <div className="d-flex justify-content-end mb-2">
              <button className="btn btn-success me-2"><FaPlus /> Add</button>
              <button className="btn btn-danger me-2" onClick={handleDeleteEntities}><FaTrash /> Delete</button>
              <DropdownButton title={<FaEllipsisV />} variant="secondary">
                <Dropdown.Item onClick={() => handleAction("Reboot")}>Reboot</Dropdown.Item>
                <Dropdown.Item onClick={() => handleAction("Power Off")}>Power Off</Dropdown.Item>
              </DropdownButton>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>BM IP</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentEntities.map((entity) => (
                  <tr key={entity.id}>
                    <td><input type="checkbox" onChange={() => toggleEntitySelection(entity.id)} checked={selectedEntities.has(entity.id)} /></td>
                    <td style={{ cursor: "pointer" }} onClick={() => setSelectedEntity(entity)}>{entity.name}</td>
                    <td><a href={`http://${entity.bm_ip}`} target="_blank" rel="noopener noreferrer">{entity.bm_ip}</a></td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: entity.status === "online" ? "green" : "red" }}></span>
                        {entity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
              <span>Page {currentPage} of {Math.ceil(entities.length / itemsPerPage)}</span>
              <button className="btn btn-secondary" disabled={currentPage === Math.ceil(entities.length / itemsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
            {selectedEntity && (
              <div className="mt-4">
                <h3>Details</h3>
                <p><strong>ID:</strong> {selectedEntity.id}</p>
                <p><strong>Name:</strong> {selectedEntity.name}</p>
                <p><strong>Created At:</strong> {selectedEntity.createdAt}</p>
                <p><strong>Status:</strong> {selectedEntity.status}</p>
              </div>
            )}
          </>
        ) : (
          <h4>Select an entity from the sidebar</h4>
        )}
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default App;
