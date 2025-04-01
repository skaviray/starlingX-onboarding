import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { api } from '../services/api';
import { Table, Spinner } from 'react-bootstrap';

function SystemController() {
  const [showModal, setShowModal] = useState(false);
  const [newController, setNewController] = useState({
    name: "",
    status: "Active"
  });
  const [systemControllers, setSystemControllers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSystemControllers();
  }, []);

  const fetchSystemControllers = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/systemcontrollers');
      setSystemControllers(data);
    } catch (err) {
      setError('Failed to fetch system controllers');
      console.error('Error fetching system controllers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    const newId = Math.max(...systemControllers.map(c => c.id)) + 1;
    setSystemControllers([...systemControllers, { ...newController, id: newId }]);
    setShowModal(false);
    setNewController({ name: "", status: "Active" });
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
        <h2 className="mb-0">System Controllers</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>Create System Controller
        </button>
      </div>

      {/* Create Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} 
           style={{ display: showModal ? 'block' : 'none' }}
           tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New System Controller</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newController.name}
                  onChange={(e) => setNewController({ ...newController, name: e.target.value })}
                  placeholder="Enter System Controller Name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={newController.status}
                  onChange={(e) => setNewController({ ...newController, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
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
                disabled={!newController.name}
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

      {systemControllers.length === 0 ? (
        <div className="text-center p-5">
          <h4 className="text-muted">No System Controllers Added Yet</h4>
          <p className="text-muted">Click the "Create System Controller" button to add one.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemControllers.map((controller) => (
                <tr key={controller.id}>
                  <td>{controller.id}</td>
                  <td>
                    <Link 
                      to={`/systemcontroller/${controller.id}`}
                      className="text-decoration-none"
                    >
                      {controller.name}
                    </Link>
                  </td>
                  <td>
                    <span className={`badge ${
                      controller.status === "Active" ? "bg-success" :
                      controller.status === "Inactive" ? "bg-danger" :
                      "bg-warning"
                    }`}>
                      {controller.status}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id={`dropdownMenuButton${controller.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Actions
                      </button>
                      <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${controller.id}`}>
                        <li><Link className="dropdown-item" to={`/systemcontroller/${controller.id}`}>View Details</Link></li>
                        <li><a className="dropdown-item" href="#">Configure</a></li>
                        <li><a className="dropdown-item" href="#">Add Node</a></li>
                        <li><a className="dropdown-item" href="#">c0-bootstrap</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item text-danger" href="#">Delete</a></li>
                      </ul>
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

export default SystemController;
