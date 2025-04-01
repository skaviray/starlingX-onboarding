import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { api } from '../services/api';
import { Table, Spinner } from 'react-bootstrap';

function Subclouds() {
  const [subclouds, setSubclouds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubclouds();
  }, []);

  const fetchSubclouds = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/subclouds');
      setSubclouds(data);
    } catch (err) {
      setError('Failed to fetch subclouds');
      console.error('Error fetching subclouds:', err);
    } finally {
      setIsLoading(false);
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
      <h2 className="mb-4">Subclouds</h2>
      {subclouds.length === 0 ? (
        <div className="text-center p-5">
          <h4 className="text-muted">No Subclouds Added Yet</h4>
          <p className="text-muted">Subclouds will appear here once they are added to the system.</p>
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
              {subclouds.map((subcloud) => (
                <tr key={subcloud.id}>
                  <td>{subcloud.id}</td>
                  <td>
                    <Link 
                      to={`/subclouds/${subcloud.id}`}
                      className="text-decoration-none"
                    >
                      {subcloud.name}
                    </Link>
                  </td>
                  <td>
                    <span className={`badge ${
                      subcloud.status === "Active" ? "bg-success" :
                      subcloud.status === "Inactive" ? "bg-danger" :
                      "bg-warning"
                    }`}>
                      {subcloud.status}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id={`dropdownMenuButton${subcloud.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Actions
                      </button>
                      <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${subcloud.id}`}>
                        <li><Link className="dropdown-item" to={`/subclouds/${subcloud.id}`}>View Details</Link></li>
                        <li><a className="dropdown-item" href="#">Edit</a></li>
                        <li><a className="dropdown-item" href="#">Restart</a></li>
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

export default Subclouds;
