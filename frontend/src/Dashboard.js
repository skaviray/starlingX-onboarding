import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEllipsisV } from "react-icons/fa";
import { Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
import API_BASE from "./Consts";
import Sidebar from "./Sibebar";
import Topbar from "./Topbar";
import SystemControllerOverview from "./systemcontroller";

const Dashboard = () => {
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [entities, setEntities] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const log = (message, data = null) => {
    console.log(`[LOG] ${message}`);
    if (data) console.log("Response:", data);
  };

  // Reset inactivity timeout
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => navigate("/login"), 60000); // Redirect after 1 min of inactivity
  };

  useEffect(() => {
    resetTimeout();

    const handleActivity = () => resetTimeout();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, []);

  const fetchEntities = (category,type) => {
    axios.get(`${API_BASE}/${category.toLowerCase()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    }).then((res) => {
      setEntities(res.data || []);
      setSelectedEntityType(type);
      setSelectedEntities(new Set());
      setSelectedEntity(null);
      setCurrentPage(1);
    }).catch((error) => console.error("Error fetching:", error));
  };

  const toggleEntitySelection = (id) => {
    setSelectedEntities((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
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
    <div>
      {/* <Topbar onLogout={() => navigate("/login")} /> */}
      <Sidebar setSelectedEntityType={fetchEntities} onLogout={() => navigate("/login")} />  
      <div className="d-flex" style={{ marginTop: "50px" }}>  {/* Sidebar starts below TopBar */}
        <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}> {/* Space left for sidebar */}
          {selectedEntityType ? (
            <>
              <h2>{selectedEntityType}</h2>
              <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-success me-2"><FaPlus /> Add</button>
                <button className="btn btn-danger me-2" onClick={() => handleDeleteEntities}><FaTrash /> Delete</button>
                <DropdownButton title={<FaEllipsisV />} variant="secondary">
                 <Dropdown.Item onClick={() => handleAction("Reboot")}>Reboot</Dropdown.Item>
                 <Dropdown.Item onClick={() => handleAction("Power Off")}>Power Off</Dropdown.Item>
                </DropdownButton>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Select</th><th>Name</th><th>IP</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((entity) => (
                    <tr key={entity.id}>
                      <td><input type="checkbox" onChange={() => toggleEntitySelection(entity.id)} checked={selectedEntities.has(entity.id)} /></td>
                      <td style={{ cursor: "pointer" }} onClick={() => setSelectedEntity(entity)}>{entity.name}</td>
                      <td><a href={`http://${entity.ip_address}`} target="_blank" rel="noopener noreferrer">{entity.ip_address}</a></td>
                      <td>
                        <span className="d-inline-flex align-items-center">
                          <span className="me-2" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: entity.status === "online" ? "green" : "red" }}></span>
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
            // <div>
            //   <SystemControllerOverview ></SystemControllerOverview>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
