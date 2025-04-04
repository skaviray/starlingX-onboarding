import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../services/api';
import { Spinner } from 'react-bootstrap';

function NodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [node, setNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNodeDetails();
  }, [id]);

  const fetchNodeDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.get(`/nodes/${id}`);
      setNode(data);
    } catch (err) {
      setError('Failed to fetch node details');
      console.error('Error fetching node:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "hardware", label: "Hardware" },
    { id: "configuration", label: "Configuration" },
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

  if (!node) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Node not found
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate("/nodes")}
        >
          ← Back
        </button>
        <h2 className="mb-0">Node {node.name} Details</h2>
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
                        <td>{node.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{node.name}</td>
                      </tr>
                      <tr>
                        <th>Hostname</th>
                        <td>{node.host_name}</td>
                      </tr>
                      <tr>
                        <th>BM IP</th>
                        <td>{node.bm_ip}</td>
                      </tr>
                      <tr>
                        <th>Role</th>
                        <td>
                          <span className={`badge ${
                            node.role === "controller" ? "bg-primary" :
                            node.role === "worker" ? "bg-success" :
                            node.role === "storage" ? "bg-warning" :
                            "bg-info"
                          }`}>
                            {node.role}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className={`badge ${
                            node.status === "active" ? "bg-success" :
                            node.status === "provisioning" ? "bg-warning" :
                            node.status === "error" ? "bg-danger" :
                            "bg-secondary"
                          }`}>
                            {node.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Parent Type</th>
                        <td>{node.parent_type}</td>
                      </tr>
                      <tr>
                        <th>Parent ID</th>
                        <td>{node.parent_id}</td>
                      </tr>
                      <tr>
                        <th>Created At</th>
                        <td>{new Date(node.created_at).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <h6>Node Health</h6>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: '75%' }}>
                      CPU: 75%
                    </div>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: '60%' }}>
                      Memory: 60%
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: '40%' }}>
                      Storage: 40%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "hardware" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Hardware</h5>
              <p>Hardware information will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === "configuration" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Configuration</h5>
              <p>Configuration information will be displayed here.</p>
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

export default NodeDetail;
