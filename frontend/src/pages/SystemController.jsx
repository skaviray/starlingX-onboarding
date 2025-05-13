import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { api } from '../services/api';
import { Table, Spinner, Form, Row, Col, Alert, Tabs, Tab, Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import {ActionsDropDown} from './Helpers'
import axios from 'axios'


function SystemController() {
  const systemControllerActions = ["Bootstrap","Configure","Swact"]
  const [showModal, setShowModal] = useState(false);
  const [showImportModal,setShowImportModal] = useState(false)
  const [systemControllers, setSystemControllers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [systemController, setSystemController] = useState({
    name: "",
    oam_floating_ip: "",
    admin_pass: ""
  })

  const [systemControllerFiles, setSystemControllerFiles] = useState({
    bootstrap_values: "",
    install_values: "",
    deploy_config: ""
  })
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

  const handleCreate = async () => {
    console.log("Created")
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
  const resetImportModal = () => {
    setShowImportModal(false)
    setSystemController({
      name: "",
      oam_floating_ip: "",
      admin_pass: ""
    })
    console.log(systemController)
  }
  const handleImport = async () => {
    try {    
      console.log(systemController)
      await api.post('/systemcontrollers/import', systemController);
      resetImportModal()
      console.log(systemController)
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendError = error.response.data?.error || "Unknown backend error";
        alert(`Import failed:\n${backendError}`);
      } else {
        alert(`${error.message}`);
      }
    }
  }
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">System Controllers</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>Create
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => setShowImportModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>Import
        </button>
      </div>
      {/* <ImportForm /> */}
    <Modal show={showImportModal} onHide={() => setShowImportModal(false)} animation={false}>
      <Modal.Header closeButton onClick={resetImportModal}>
        <Modal.Title>Enter System Controller Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
        <Form.Label column sm="2">
          Name
        </Form.Label>
        <Col sm="10">
          <Form.Control type="text" 
          placeholder="site-1" 
          required
          value={systemController.name}
          onChange={(e) => setSystemController({...systemController,name: e.target.value})}
          />
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3" controlId="formFIP">
        <Form.Label column sm="2">
          FloatingIp
        </Form.Label>
        <Col sm="10">
          <Form.Control 
          type="text" 
          placeholder="128.224.212.103"
          required
          value={systemController.oam_floating_ip}
          onChange={(e) => setSystemController({...systemController,oam_floating_ip: e.target.value})}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPlainTextPassword">
        <Form.Label column sm="2">
          Admin-Password
        </Form.Label>
        <Col sm="10">
          <Form.Control 
          type="password" 
          placeholder="password" 
          required
          value={systemController.admin_pass}
          onChange={(e) => setSystemController({...systemController, admin_pass: e.target.value})}
          />
        </Col>
      </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={resetImportModal}>
          Close
        </Button>
        <Button 
        variant="primary" 
        onClick={handleImport}   
        disabled={
          !systemController.name.trim() ||
          !systemController.oam_floating_ip.trim() ||
          !systemController.admin_pass.trim()
  }>
          Import 
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showModal} onHide={() => setShowModal(false)} animation={false}>
      {/* <ModalHeader closeButton>

      </ModalHeader> */}
      <ModalBody>
      <Form.Group controlId="formInstallFile" className="mb-3">
        <Form.Label>Install Values File</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <Form.Group controlId="formBootstrapFile" className="mb-3">
        <Form.Label>Bootstrap Values File</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
      <Form.Group controlId="formDeploymentConfig" className="mb-3">
        <Form.Label>Deployment Config File</Form.Label>
        <Form.Control type="file"/>
      </Form.Group>
      </ModalBody>
      <ModalFooter>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </ModalFooter>
    </Modal>

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
                      controller.status === "active" ? "bg-success" :
                      controller.status === "deploying" ? "bg-warning" :
                      controller.status === "maintenance" ? "bg-info" :
                      controller.status === "error" ? "bg-danger" :
                      "bg-secondary"
                    }`}>
                      {controller.status}
                    </span>
                  </td>
                  <td>
                    <ActionsDropDown actions={systemControllerActions}></ActionsDropDown>
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
