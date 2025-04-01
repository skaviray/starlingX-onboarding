import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../services/api';
import { Spinner } from 'react-bootstrap';

function SubcloudDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [subcloud, setSubcloud] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubcloudDetails();
  }, [id]);

  const fetchSubcloudDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.get(`/subclouds/${id}`);
      setSubcloud(data);
    } catch (err) {
      setError('Failed to fetch subcloud details');
      console.error('Error fetching subcloud:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "resources", label: "Resources" },
    { id: "services", label: "Services" },
    { id: "logs", label: "Logs" },
  ];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  if (!subcloud) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Subcloud not found
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate("/subclouds")}
        >
          ← Back
        </button>
        <h2 className="mb-0">Subcloud {subcloud.name} Details</h2>
      </div>

      <ul className="nav nav-tabs mb-4">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Overview</h5>
              <div className="row">
                <div className="col-md-6">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>ID</th>
                        <td>{subcloud.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{subcloud.name}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className={`badge ${
                            subcloud.status === "Active" ? "bg-success" :
                            subcloud.status === "Inactive" ? "bg-danger" :
                            "bg-warning"
                          }`}>
                            {subcloud.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>System Controller</th>
                        <td>{subcloud.systemController}</td>
                      </tr>
                      <tr>
                        <th>Last Updated</th>
                        <td>{new Date(subcloud.lastUpdated || Date.now()).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <h6>System Resources</h6>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: `${subcloud.cpuUsage || 0}%` }}>
                      CPU: {subcloud.cpuUsage || 0}%
                    </div>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: `${subcloud.memoryUsage || 0}%` }}>
                      Memory: {subcloud.memoryUsage || 0}%
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: `${subcloud.storageUsage || 0}%` }}>
                      Storage: {subcloud.storageUsage || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resources</h5>
              <p>Resource information will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Services</h5>
              <p>Service information will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Logs</h5>
              <p>Log information will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubcloudDetail; 