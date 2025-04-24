import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { api } from '../services/api';
import { Table, Spinner, Form, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import {ActionsDropDown} from './Helpers'

function SystemController() {
  const systemControllerActions = ["Bootstrap","Configure","Swact"]
  const [showModal, setShowModal] = useState(false);
  const [newController, setNewController] = useState({
    name: "",
    oam_floating: "",
    oam_controller_0: "",
    oam_controller_1: "",
    config: {
      type: "system-controller",
      controllers: [],
      storages: [],
      workers: [],
      network_config: {
        oam: "",
        cluster_host: "",
        mgmt: "",
        admin: ""
      },
      ntp_Servers: [],
      dns_Servers: []
    },
    status: "deploying"
  });
  const [systemControllers, setSystemControllers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [importJson, setImportJson] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("basic");
  
  // Controller node fields
  const [controllerNode, setControllerNode] = useState({
    bm_ip: "",
    bm_user: "",
    bm_pass: "",
    bm_type: "IPMI",
    personality: "controller",
    pxe_device: "eth0",
    pxe: "DHCP",
    ceph_disks: ["sda"],
    root_disk: ["sdb"],
    hostname: ""
  });

  const [storageNode, setStorageNode] = useState({
    bm_ip: "",
    bm_user: "",
    bm_pass: "",
    bm_type: "IPMI",
    personality: "storage",
    pxe_device: "eth0",
    pxe: "DHCP",
    ceph_disks: ["sda"],
    root_disk: ["sdb"],
    hostname: ""
  });

  const [workerNode, setWorkerNode] = useState({
    bm_ip: "",
    bm_user: "",
    bm_pass: "",
    bm_type: "IPMI",
    personality: "storage",
    pxe_device: "eth0",
    pxe: "DHCP",
    ceph_disks: ["sda"],
    root_disk: ["sdb"],
    hostname: ""
  });
  
  // Network config fields
  const [networkConfig, setNetworkConfig] = useState({
    oam: "10.10.10.0/24",
    cluster_host: "192.168.10.0/24",
    mgmt: "192.168.11.0/24",
    admin: "192.168.12.0/24"
  });
  
  // Server fields
  const [ntpServers, setNtpServers] = useState(["0.pool.ntp.org", "1.pool.ntp.org"]);
  const [dnsServers, setDnsServers] = useState(["8.8.8.8", "8.8.4.4"]);

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
    try {
      setCreateError(null);
      
      // Create a copy of the newController with updated config
      const controllerToCreate = {
        ...newController,
        config: {
          ...newController.config,
          controllers: [controllerNode],
          network_config: networkConfig,
          ntp_Servers: ntpServers,
          dns_Servers: dnsServers
        }
      };
      
      await api.post('/systemcontrollers', controllerToCreate);
    setShowModal(false);
      resetForm();
      fetchSystemControllers();
    } catch (err) {
      console.error('Error creating system controller:', err);
      setCreateError('Failed to create System Controller. Please check your inputs.');
    }
  };
  
  const resetForm = () => {
    setNewController({
      name: "",
      oam_floating: "",
      oam_controller_0: "",
      oam_controller_1: "",
      config: {
        type: "system-controller",
        controllers: [],
        storages: [],
        workers: [],
        network_config: {
          oam: "",
          cluster_host: "",
          mgmt: "",
          admin: ""
        },
        ntp_Servers: [],
        dns_Servers: []
      },
      status: "deploying"
    });
    setControllerNode({
      bm_ip: "",
      bm_user: "",
      bm_pass: "",
      bm_type: "IPMI",
      personality: "controller",
      pxe_device: "eth0",
      pxe: "DHCP",
      ceph_disks: ["sda"],
      root_disk: ["sdb"],
      hostname: ""
    });
    setNetworkConfig({
      oam: "10.10.10.0/24",
      cluster_host: "192.168.10.0/24",
      mgmt: "192.168.11.0/24",
      admin: "192.168.12.0/24"
    });
    setNtpServers(["0.pool.ntp.org", "1.pool.ntp.org"]);
    setDnsServers(["8.8.8.8", "8.8.4.4"]);
    setImportJson("");
    setJsonError(null);
    setActiveFormTab("basic");
  };
  
  const handleImportJson = () => {
    try {
      setJsonError(null);
      if (!importJson.trim()) {
        setJsonError("Please enter JSON configuration");
        return;
      }
      
      const parsedConfig = JSON.parse(importJson);
      
      // Validate required fields
      if (!parsedConfig.type || !parsedConfig.controllers || !parsedConfig.network_config || 
          !parsedConfig.ntp_Servers || !parsedConfig.dns_Servers) {
        setJsonError("Invalid configuration format. Missing required fields.");
        return;
      }
      
      // Set the parsed config
      setNewController({
        ...newController,
        config: parsedConfig
      });
      
      // If there's at least one controller, use it to populate the form
      if (parsedConfig.controllers && parsedConfig.controllers.length > 0) {
        setControllerNode(parsedConfig.controllers[0]);
      }
      
      // Set network config
      if (parsedConfig.network_config) {
        setNetworkConfig(parsedConfig.network_config);
      }
      
      // Set servers
      if (parsedConfig.ntp_Servers) {
        setNtpServers(parsedConfig.ntp_Servers);
      }
      
      if (parsedConfig.dns_Servers) {
        setDnsServers(parsedConfig.dns_Servers);
      }
      
      // Switch to basic tab
      setActiveFormTab("basic");
    } catch (err) {
      setJsonError("Invalid JSON format. Please check your JSON syntax.");
      console.error('Error parsing JSON:', err);
    }
  };
  
  // Helper function to handle array input changes
  const handleArrayChange = (type, index, value) => {
    if (type === 'ntp') {
      const newServers = [...ntpServers];
      newServers[index] = value;
      setNtpServers(newServers);
    } else if (type === 'dns') {
      const newServers = [...dnsServers];
      newServers[index] = value;
      setDnsServers(newServers);
    } else if (type === 'ceph') {
      const newDisks = [...controllerNode.ceph_disks];
      newDisks[index] = value;
      setControllerNode({...controllerNode, ceph_disks: newDisks});
    } else if (type === 'root') {
      const newDisks = [...controllerNode.root_disk];
      newDisks[index] = value;
      setControllerNode({...controllerNode, root_disk: newDisks});
    }
  };
  
  // Helper function to add array items
  const addArrayItem = (type) => {
    if (type === 'ntp') {
      setNtpServers([...ntpServers, ""]);
    } else if (type === 'dns') {
      setDnsServers([...dnsServers, ""]);
    } else if (type === 'ceph') {
      setControllerNode({...controllerNode, ceph_disks: [...controllerNode.ceph_disks, ""]});
    } else if (type === 'root') {
      setControllerNode({...controllerNode, root_disk: [...controllerNode.root_disk, ""]});
    }
  };
  
  // Helper function to remove array items
  const removeArrayItem = (type, index) => {
    if (type === 'ntp') {
      const newServers = [...ntpServers];
      newServers.splice(index, 1);
      setNtpServers(newServers);
    } else if (type === 'dns') {
      const newServers = [...dnsServers];
      newServers.splice(index, 1);
      setDnsServers(newServers);
    } else if (type === 'ceph') {
      const newDisks = [...controllerNode.ceph_disks];
      newDisks.splice(index, 1);
      setControllerNode({...controllerNode, ceph_disks: newDisks});
    } else if (type === 'root') {
      const newDisks = [...controllerNode.root_disk];
      newDisks.splice(index, 1);
      setControllerNode({...controllerNode, root_disk: newDisks});
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
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New System Controller</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {createError && (
                <Alert variant="danger">{createError}</Alert>
              )}
              
              <Tabs
                activeKey={activeFormTab}
                onSelect={(k) => setActiveFormTab(k)}
                className="mb-4"
              >
                <Tab eventKey="basic" title="Basic Info">
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                  type="text"
                  value={newController.name}
                  onChange={(e) => setNewController({ ...newController, name: e.target.value })}
                  placeholder="Enter System Controller Name"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>OAM Floating IP</Form.Label>
                          <Form.Control
                            type="text"
                            value={newController.oam_floating}
                            onChange={(e) => setNewController({ ...newController, oam_floating: e.target.value })}
                            placeholder="e.g. 10.10.10.10"
                            required
                          />
                          <Form.Text className="text-muted">
                            Virtual IP for OAM network
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>OAM Controller 0 IP</Form.Label>
                          <Form.Control
                            type="text"
                            value={newController.oam_controller_0}
                            onChange={(e) => setNewController({ ...newController, oam_controller_0: e.target.value })}
                            placeholder="e.g. 10.10.10.11"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>OAM Controller 1 IP</Form.Label>
                          <Form.Control
                            type="text"
                            value={newController.oam_controller_1}
                            onChange={(e) => setNewController({ ...newController, oam_controller_1: e.target.value })}
                            placeholder="e.g. 10.10.10.12"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
                
                <Tab eventKey="controller" title="Controller Node">
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Controller Hostname</Form.Label>
                          <Form.Control
                            type="text"
                            value={controllerNode.hostname}
                            onChange={(e) => setControllerNode({ ...controllerNode, hostname: e.target.value })}
                            placeholder="Optional hostname"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>BM Type</Form.Label>
                          <Form.Select
                            value={controllerNode.bm_type}
                            onChange={(e) => setControllerNode({ ...controllerNode, bm_type: e.target.value })}
                          >
                            <option value="IPMI">IPMI</option>
                            <option value="REDFISH">REDFISH</option>
                            <option value="UEFI">UEFI</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM IP</Form.Label>
                          <Form.Control
                            type="text"
                            value={controllerNode.bm_ip}
                            onChange={(e) => setControllerNode({ ...controllerNode, bm_ip: e.target.value })}
                            placeholder="Board management IP"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM User</Form.Label>
                          <Form.Control
                            type="text"
                            value={controllerNode.bm_user}
                            onChange={(e) => setControllerNode({ ...controllerNode, bm_user: e.target.value })}
                            placeholder="Username"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={controllerNode.bm_pass}
                            onChange={(e) => setControllerNode({ ...controllerNode, bm_pass: e.target.value })}
                            placeholder="Password"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>PXE Device</Form.Label>
                          <Form.Control
                            type="text"
                            value={controllerNode.pxe_device}
                            onChange={(e) => setControllerNode({ ...controllerNode, pxe_device: e.target.value })}
                            placeholder="e.g. eth0"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>PXE</Form.Label>
                          <Form.Select
                            value={controllerNode.pxe}
                            onChange={(e) => setControllerNode({ ...controllerNode, pxe: e.target.value })}
                          >
                            <option value="DHCP">DHCP</option>
                            <option value="STATIC">STATIC</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Ceph Disks</Form.Label>
                      {controllerNode.ceph_disks.map((disk, index) => (
                        <Row key={`ceph-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={disk}
                              onChange={(e) => handleArrayChange('ceph', index, e.target.value)}
                              placeholder="e.g. sda"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('ceph', index)}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('ceph')}
                      >
                        Add Ceph Disk
                      </button>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Root Disks</Form.Label>
                      {controllerNode.root_disk.map((disk, index) => (
                        <Row key={`root-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={disk}
                              onChange={(e) => handleArrayChange('root', index, e.target.value)}
                              placeholder="e.g. sdb"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('root', index)}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('root')}
                      >
                        Add Root Disk
                      </button>
                    </Form.Group>
                  </Form>
                </Tab>
                <Tab eventKey="storage" title="Storage Node">
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Storage Hostname</Form.Label>
                          <Form.Control
                            type="text"
                            value={storageNode.hostname}
                            onChange={(e) => setStorageNode({ ...storageNode, hostname: e.target.value })}
                            placeholder="Optional hostname"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>BM Type</Form.Label>
                          <Form.Select
                            value={storageNode.bm_type}
                            onChange={(e) => setStorageNode({ ...storageNode, bm_type: e.target.value })}
                          >
                            <option value="IPMI">IPMI</option>
                            <option value="REDFISH">REDFISH</option>
                            <option value="UEFI">UEFI</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM IP</Form.Label>
                          <Form.Control
                            type="text"
                            value={storageNode.bm_ip}
                            onChange={(e) => setStorageNode({ ...storageNode, bm_ip: e.target.value })}
                            placeholder="Board management IP"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM User</Form.Label>
                          <Form.Control
                            type="text"
                            value={storageNode.bm_user}
                            onChange={(e) => setStorageNode({ ...storageNode, bm_user: e.target.value })}
                            placeholder="Username"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={storageNode.bm_pass}
                            onChange={(e) => setStorageNode({ ...storageNode, bm_pass: e.target.value })}
                            placeholder="Password"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>PXE Device</Form.Label>
                          <Form.Control
                            type="text"
                            value={storageNode.pxe_device}
                            onChange={(e) => setStorageNode({ ...storageNode, pxe_device: e.target.value })}
                            placeholder="e.g. eth0"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>PXE</Form.Label>
                          <Form.Select
                            value={storageNode.pxe}
                            onChange={(e) => setStorageNode({ ...storageNode, pxe: e.target.value })}
                          >
                            <option value="DHCP">DHCP</option>
                            <option value="STATIC">STATIC</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Ceph Disks</Form.Label>
                      {storageNode.ceph_disks.map((disk, index) => (
                        <Row key={`ceph-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={disk}
                              onChange={(e) => handleArrayChange('ceph', index, e.target.value)}
                              placeholder="e.g. sda"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('ceph', index)}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('ceph')}
                      >
                        Add Ceph Disk
                      </button>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Root Disks</Form.Label>
                      {storageNode.root_disk.map((disk, index) => (
                        <Row key={`root-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={disk}
                              onChange={(e) => handleArrayChange('root', index, e.target.value)}
                              placeholder="e.g. sdb"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('root', index)}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('root')}
                      >
                        Add Root Disk
                      </button>
                    </Form.Group>
                  </Form>
                </Tab>    

                <Tab eventKey="workers" title="Worker Node">
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Worker Hostname</Form.Label>
                          <Form.Control
                            type="text"
                            value={workerNode.hostname}
                            onChange={(e) => setWorkerNode({ ...workerNode, hostname: e.target.value })}
                            placeholder="Optional hostname"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>BM Type</Form.Label>
                          <Form.Select
                            value={workerNode.bm_type}
                            onChange={(e) => setWorkerNode({ ...workerNode, bm_type: e.target.value })}
                          >
                            <option value="IPMI">IPMI</option>
                            <option value="REDFISH">REDFISH</option>
                            <option value="UEFI">UEFI</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM IP</Form.Label>
                          <Form.Control
                            type="text"
                            value={workerNode.bm_ip}
                            onChange={(e) => setWorkerNode({ ...workerNode, bm_ip: e.target.value })}
                            placeholder="Board management IP"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM User</Form.Label>
                          <Form.Control
                            type="text"
                            value={workerNode.bm_user}
                            onChange={(e) => setWorkerNode({ ...workerNode, bm_user: e.target.value })}
                            placeholder="Username"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>BM Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={workerNode.bm_pass}
                            onChange={(e) => setWorkerNode({ ...workerNode, bm_pass: e.target.value })}
                            placeholder="Password"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>PXE Device</Form.Label>
                          <Form.Control
                            type="text"
                            value={workerNode.pxe_device}
                            onChange={(e) => setWorkerNode({ ...workerNode, pxe_device: e.target.value })}
                            placeholder="e.g. eth0"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>PXE</Form.Label>
                          <Form.Select
                            value={workerNode.pxe}
                            onChange={(e) => setWorkerNode({ ...workerNode, pxe: e.target.value })}
                          >
                            <option value="DHCP">DHCP</option>
                            <option value="STATIC">STATIC</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Ceph Disks</Form.Label>
                      {workerNode.ceph_disks.map((disk, index) => (
                        <Row key={`ceph-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={disk}
                              onChange={(e) => handleArrayChange('ceph', index, e.target.value)}
                              placeholder="e.g. sda"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('ceph', index)}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('ceph')}
                      >
                        Add Ceph Disk
                      </button>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Root Disks</Form.Label>
                      {workerNode.root_disk.map((disk, index) => (
                        <Row key={`root-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={disk}
                              onChange={(e) => handleArrayChange('root', index, e.target.value)}
                              placeholder="e.g. sdb"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('root', index)}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('root')}
                      >
                        Add Root Disk
                      </button>
                    </Form.Group>
                  </Form>
                </Tab>              
                <Tab eventKey="network" title="Network Config">
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>OAM Network CIDR</Form.Label>
                          <Form.Control
                            type="text"
                            value={networkConfig.oam}
                            onChange={(e) => setNetworkConfig({ ...networkConfig, oam: e.target.value })}
                            placeholder="e.g. 10.10.10.0/24"
                            required
                          />
                          <Form.Text className="text-muted">
                            Operations, Administration & Management network
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Cluster Host Network CIDR</Form.Label>
                          <Form.Control
                            type="text"
                            value={networkConfig.cluster_host}
                            onChange={(e) => setNetworkConfig({ ...networkConfig, cluster_host: e.target.value })}
                            placeholder="e.g. 192.168.10.0/24"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Management Network CIDR</Form.Label>
                          <Form.Control
                            type="text"
                            value={networkConfig.mgmt}
                            onChange={(e) => setNetworkConfig({ ...networkConfig, mgmt: e.target.value })}
                            placeholder="e.g. 192.168.11.0/24"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Admin Network CIDR</Form.Label>
                          <Form.Control
                            type="text"
                            value={networkConfig.admin}
                            onChange={(e) => setNetworkConfig({ ...networkConfig, admin: e.target.value })}
                            placeholder="e.g. 192.168.12.0/24"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
                
                <Tab eventKey="servers" title="Servers">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>NTP Servers</Form.Label>
                      {ntpServers.map((server, index) => (
                        <Row key={`ntp-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={server}
                              onChange={(e) => handleArrayChange('ntp', index, e.target.value)}
                              placeholder="e.g. 0.pool.ntp.org"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('ntp', index)}
                              disabled={ntpServers.length <= 1}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('ntp')}
                      >
                        Add NTP Server
                      </button>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>DNS Servers</Form.Label>
                      {dnsServers.map((server, index) => (
                        <Row key={`dns-${index}`} className="mb-2">
                          <Col md={10}>
                            <Form.Control
                              type="text"
                              value={server}
                              onChange={(e) => handleArrayChange('dns', index, e.target.value)}
                              placeholder="e.g. 8.8.8.8"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-center">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArrayItem('dns', index)}
                              disabled={dnsServers.length <= 1}
                            >
                              Remove
                            </button>
                          </Col>
                        </Row>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary mt-2"
                        onClick={() => addArrayItem('dns')}
                      >
                        Add DNS Server
                      </button>
                    </Form.Group>
                  </Form>
                </Tab>
                
                <Tab eventKey="json" title="Import JSON">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Import Configuration JSON</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        value={importJson}
                        onChange={(e) => setImportJson(e.target.value)}
                        placeholder="Paste your JSON configuration here"
                      />
                      <Form.Text className="text-muted">
                        Paste a valid SystemConfig JSON to automatically fill the form fields
                      </Form.Text>
                    </Form.Group>
                    
                    {jsonError && (
                      <Alert variant="danger" className="mt-3">
                        {jsonError}
                      </Alert>
                    )}
                    
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleImportJson}
                    >
                      Import JSON
                    </button>
                  </Form>
                </Tab>
              </Tabs>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!newController.name || !newController.oam_floating || 
                  !newController.oam_controller_0 || !newController.oam_controller_1 || 
                  !controllerNode.bm_ip || !controllerNode.bm_user || !controllerNode.bm_pass}
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
