import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import SystemController from './pages/SystemController';
import SystemControllerDetail from './pages/SystemControllerDetail';
import Subclouds from './pages/Subclouds';
import SubcloudDetail from './pages/SubcloudDetail';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="d-flex">
        {isAuthenticated && <Sidebar />}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Navigate to="/systemcontroller" replace />} />
                <Route path="/systemcontroller" element={<SystemController />} />
                <Route path="/systemcontroller/:id" element={<SystemControllerDetail />} />
                <Route path="/subclouds" element={<Subclouds />} />
                <Route path="/subclouds/:id" element={<SubcloudDetail />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 