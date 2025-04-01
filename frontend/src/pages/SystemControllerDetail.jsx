import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../services/api';
import { Spinner } from 'react-bootstrap';

function SystemControllerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [controller, setController] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchControllerDetails();
  }, [id]);

  const fetchControllerDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.get(`/systemcontrollers/${id}`);
      setController(data);
    } catch (err) {
      setError('Failed to fetch system controller details');
      console.error('Error fetching system controller:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "controllers", label: "Controllers" },
    { id: "storages", label: "Storages" },
    { id: "compute", label: "Compute" },
    { id: "subclouds", label: "Subclouds" },
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

  if (!controller) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        System Controller not found
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate("/systemcontroller")}
        >
          ← Back
        </button>
        <h2 className="mb-0">System Controller {controller.name} Details</h2>
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
                        <td>{controller.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{controller.name}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className={`badge ${
                            controller.status === "Active" ? "bg-success" :
                            controller.status === "Inactive" ? "bg-danger" :
                            "bg-warning"
                          }`}>
                            {controller.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Last Updated</th>
                        <td>{new Date(controller.lastUpdated || Date.now()).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <h6>System Resources</h6>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: `${controller.cpuUsage || 0}%` }}>
                      CPU: {controller.cpuUsage || 0}%
                    </div>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: `${controller.memoryUsage || 0}%` }}>
                      Memory: {controller.memoryUsage || 0}%
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: `${controller.storageUsage || 0}%` }}>
                      Storage: {controller.storageUsage || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "controllers" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Controllers</h5>
              <p>Controller information will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === "storages" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Storages</h5>
              <p>Storage information will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === "compute" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Compute</h5>
              <p>Compute information will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === "subclouds" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Subclouds</h5>
              <p>Subcloud information will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemControllerDetail; 