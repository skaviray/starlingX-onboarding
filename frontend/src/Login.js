import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE from "./Consts";


const log = (message, data = null) => {
  console.log(`[LOG] ${message}`);
  if (data) console.log("Response:", data);
};

axios.defaults.withCredentials = true;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    log(`Attempting login for user: ${username}`);
    axios.post(`${API_BASE}/users/login`, { username, password }, { withCredentials: true })
      .then((response) => {
        log("Login successful", response.data);
        localStorage.setItem("access_token", response.data.access_token);
        navigate("/dashboard");
      })
      .catch((error) => {
        log("Login failed", error.response ? error.response.data : error.message);
        alert("Login failed");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "350px" }}>
        <div className="text-center">
          <img src="/dog-avatar.png" alt="Dog Avatar" className="mb-3" style={{ width: "80px" }} />
          <h1 className="mb-4">WRCP Onboarding</h1>
        </div>
        <h2 className="card-title text-center">Login</h2>
        <h5 className="card-subtitle mb-3 text-muted text-center">Enter your credentials</h5>
        <form onSubmit={handleLogin}>
          <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <div className="input-group mb-3">
            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;