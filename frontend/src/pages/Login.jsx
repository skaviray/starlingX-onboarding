import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { InputGroup, Form, Container, Row, Col, Card } from 'react-bootstrap';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.login(credentials);
      
      // Store the access token and login state
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', credentials.username);
      
      navigate('/systemcontroller');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <img 
                  src="https://starlingx.io//static/f00290a68d8dc5c7cbd19cfd351da028/android-chrome-192x192.png" 
                  alt="StarlingX Logo" 
                  className="img-fluid mb-3" 
                  style={{ maxWidth: '220px' }}
                />
                <h3 className="fw-bold">Login</h3>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                    <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                      {showPassword ? "Hide" : "Show"}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </Form>
              
              <div className="text-center mt-4">
                <p className="text-muted small">
                  StarlingX Distributed Cloud Dashboard v1.0
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login; 