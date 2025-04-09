import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../services/api';
import { Spinner } from 'react-bootstrap';
import {Table, Button, Col, Nav,Row,Tab} from 'react-bootstrap'

function SystemControllerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [controllers, setControllers] = useState([])
  const [storages, setStorages] = useState([])
  const [workers, setWorkers] = useState([])
  const [controller, setController] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchControllerDetails();
    fetchControllers();
    fetchStorages();
    fetchWorkers();
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

  const fetchControllers = async () => {
    try{
      setIsLoading(true)
      const controllers = await api.get(`/systemcontrollers/${id}/controllers`);
      setControllers(controllers)
    } catch (err) {
      setError("Unable to fetch the controllers:", err);
      console.log("Error fetching controllers: ", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStorages = async () => {
    try{
      setIsLoading(true)
      const storages = await api.get(`/systemcontrollers/${id}/storages`);
      setStorages(storages)
    } catch (err) {
      setError("Unable to fetch the storages:", err);
      console.log("Error fetching storages: ", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const fetchWorkers = async () => {
    try{
      setIsLoading(true)
      const workers = await api.get(`/systemcontrollers/${id}/workers`);
      setWorkers(workers)
    } catch (err) {
      setError("Unable to fetch the workers:", err);
      console.log("Error fetching workers: ", err)
    } finally {
      setIsLoading(false)
    }
  }

  const Node = ({nodes}) => {
    console.log(nodes)
    return (
      <div className="card">
      <div className="card-body">
        <Table striped bordered hover>
          <thead>
            <th>ID</th>
            <th>NAME</th>
            <th>BM_IP</th>
            <th>STATUS</th>
            <th>Action</th>
          </thead>
          <tbody>
            {nodes.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td><a href={`https://${item.bm_ip}`} className="text-blue-600 hover:underline">https://{item.bm_ip}</a></td>
              <td>{item.status}</td>
              <td><Button>Action</Button></td>
            </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
    )
  }

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

      <Tab.Container id="left-tabs-example" defaultActiveKey="Overview">
      <Row>
        <Col sm={2}>
          <Nav variant="tabs" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="Overview">Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Subclouds">Subclouds</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Controllers">Controllers</Nav.Link> 
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Storages">Storages</Nav.Link> 
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Workers">Workers</Nav.Link> 
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="Overview">
            <div className="card">
            <div className="card-body">
              <h5 className="card-title">Overview</h5>
              <div className="row">
                <div className="col-md-12">
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
                        <th>OAM Floating</th>
                        <td>{controller.oam_floating}</td>
                      </tr>
                      <tr>
                        <th>OAM Controller 0</th>
                        <td>{controller.oam_controller_0}</td>
                      </tr>
                      <tr>
                        <th>OAM Controller 1</th>
                        <td>{controller.oam_controller_1}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className={`badge ${
                            controller.status === "active" ? "bg-success" :
                            controller.status === "maintenance" ? "bg-warning" :
                            controller.status === "error" ? "bg-danger" :
                            "bg-info"
                          }`}>
                            {controller.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Inventoried</th>
                        <td>{controller.is_inventoried ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <th>Created At</th>
                        <td>{new Date(controller.created_at).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
            </Tab.Pane>
            <Tab.Pane eventKey="Subclouds">Second tab content</Tab.Pane>
            <Tab.Pane eventKey="Controllers"><Node nodes={controllers}></Node></Tab.Pane>
            <Tab.Pane eventKey="Storages"><Node nodes={storages}></Node></Tab.Pane>
            <Tab.Pane eventKey="Workers"><Node nodes={workers}></Node></Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </div>
  );
}

export default SystemControllerDetail; 