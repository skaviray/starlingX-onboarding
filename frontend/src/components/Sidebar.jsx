import React, { Component } from 'react'
import { NavLink, useNavigate } from "react-router-dom";

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
                <ul className="nav flex-column flex-grow-1">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/systemcontroller" end>
                            SystemController
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/subclouds" end>
                            Subclouds
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/nodes" end>
                            Nodes
                        </NavLink>
                    </li>
                </ul>
                <div className="border-top pt-3">
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