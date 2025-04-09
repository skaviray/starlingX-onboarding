import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { api } from '../services/api';
import { Table, Spinner, Button } from 'react-bootstrap';
import {ActionsDropDown} from './Helpers'

function Nodes() {
  const nodeActions = ["PowerON","PowerOff","Reboot","Lock","Unlock","ForceLock"]
  const [showModal, setShowModal] = useState(false);
  const [newNode, setNewNode] = useState({
    name: "",
    hostname: "",
    bm_ip: "",
    bm_user: "",
    bm_pass: "",
    role: "controller",
    parent_type: "system_controller",
    parent_id: ""
  });
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemControllers, setSystemControllers] = useState([]);
  const [systemControllerMap, setSystemControllerMap] = useState({});

  useEffect(() => {
    fetchNodes();
    fetchSystemControllers();
  }, []);

  const fetchNodes = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/nodes?page_id=1&page_size=10');
      setNodes(data);
    } catch (err) {
      setError('Failed to fetch nodes');
      console.error('Error fetching nodes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSystemControllers = async () => {
    try {
      const data = await api.get('/systemcontrollers');
      setSystemControllers(data);
      
      // Create a map of system controller IDs to names for easier lookup
      const scMap = {};
      data.forEach(sc => {
        scMap[sc.id] = sc.name;
      });
      setSystemControllerMap(scMap);
    } catch (err) {
      console.error('Error fetching system controllers:', err);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/nodes', newNode);
      setShowModal(false);
      setNewNode({
        name: "",
        hostname: "",
        bm_ip: "",
        bm_user: "",
        bm_pass: "",
        role: "controller",
        parent_type: "system_controller",
        parent_id: ""
      });
      fetchNodes();
    } catch (err) {
      console.error('Error creating node:', err);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'controller':
        return 'bg-primary';
      case 'worker':
        return 'bg-success';
      case 'storage':
        return 'bg-warning';
      case 'aio':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

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

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Nodes</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>Create Node
        </button>
      </div>

      {/* Create Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} 
           style={{ display: showModal ? 'block' : 'none' }}
           tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Node</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newNode.name}
                  onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                  placeholder="Enter Node Name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Hostname</label>
                <input
                  type="text"
                  className="form-control"
                  value={newNode.hostname}
                  onChange={(e) => setNewNode({ ...newNode, hostname: e.target.value })}
                  placeholder="Enter Hostname"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">BM IP</label>
                <input
                  type="text"
                  className="form-control"
                  value={newNode.bm_ip}
                  onChange={(e) => setNewNode({ ...newNode, bm_ip: e.target.value })}
                  placeholder="Enter BM IP Address"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">BM User</label>
                <input
                  type="text"
                  className="form-control"
                  value={newNode.bm_user}
                  onChange={(e) => setNewNode({ ...newNode, bm_user: e.target.value })}
                  placeholder="Enter BM Username"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">BM Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newNode.bm_pass}
                  onChange={(e) => setNewNode({ ...newNode, bm_pass: e.target.value })}
                  placeholder="Enter BM Password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newNode.role}
                  onChange={(e) => setNewNode({ ...newNode, role: e.target.value })}
                >
                  <option value="controller">Controller</option>
                  <option value="worker">Worker</option>
                  <option value="storage">Storage</option>
                  <option value="aio">All-in-One</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Parent Type</label>
                <select
                  className="form-select"
                  value={newNode.parent_type}
                  onChange={(e) => setNewNode({ ...newNode, parent_type: e.target.value })}
                >
                  <option value="system_controller">System Controller</option>
                  <option value="subcloud">Subcloud</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">System Controller</label>
                <select
                  className="form-select"
                  value={newNode.parent_id}
                  onChange={(e) => setNewNode({ ...newNode, parent_id: e.target.value })}
                >
                  <option value="">Select System Controller</option>
                  {systemControllers.map((sc) => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!newNode.name || !newNode.hostname || !newNode.bm_ip || !newNode.bm_user || !newNode.bm_pass || !newNode.parent_id}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showModal && (
        <div className="modal-backdrop fade show"></div>
      )}

      {nodes.length === 0 ? (
        <div className="text-center p-5">
          <h4 className="text-muted">No Nodes Added Yet</h4>
          <p className="text-muted">Click the "Create Node" button to add one.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Hostname</th>
                <th>Role</th>
                <th>BM IP</th>
                <th>System Controller</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.id}>
                  <td>{node.id}</td>
                  <td>
                    <Link 
                      to={`/nodes/${node.id}`}
                      className="text-decoration-none"
                    >
                      {node.name}
                    </Link>
                  </td>
                  <td>{node.host_name}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(node.role)}`}>
                      {node.role}
                    </span>
                  </td>
                  <td>{node.bm_ip}</td>
                  <td>
                    {node.parent_type === "system_controller" && (
                      <Link 
                        to={`/systemcontroller/${node.parent_id}`}
                        className="text-decoration-none"
                      >
                        {systemControllerMap[node.parent_id] || `SC-${node.parent_id}`}
                      </Link>
                    )}
                    {node.parent_type === "subcloud" && (
                      <span>Subcloud-{node.parent_id}</span>
                    )}
                  </td>
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
                  <td>
                    <div>
                      <ActionsDropDown actions={nodeActions}>Actions</ActionsDropDown>
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Nodes;
