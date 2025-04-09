import React, { Component } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { Col,Nav,Row,Tab } from 'react-bootstrap';

class Sidebar extends Component {
    state = { } 
    
    handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    }

    render() { 
        return (
            <div className="bg-light border-end p-3 d-flex flex-column" style={{ width: "250px", height: "100vh" }}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row className="flex-grow-1">
                <Col sm={12}>
                <Nav variant="tabs" className="flex-column">
                    <Nav.Item>
                    <Nav.Link eventKey="first">
                    <NavLink className="nav-link" to="/systemcontroller" end>
                        SystemControllers
                    </NavLink>
                    </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="Subclouds">
                    <NavLink className="nav-link" to="/subclouds" end>
                                    Subclouds
                    </NavLink>
                    </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="Nodes">
                    <NavLink className="nav-link" to="/nodes" end>
                        Nodes
                    </NavLink>
                    </Nav.Link>
                    </Nav.Item>
                </Nav>
                </Col>
            </Row>
            </Tab.Container>
                <div className="border-top pt-3 auto">
                    <button 
                        className="btn btn-outline-danger w-100"
                        onClick={this.handleLogout}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                </div>
            </div>
        );
    }
}
 
export default Sidebar;