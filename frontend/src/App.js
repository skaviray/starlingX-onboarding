import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SystemControllerDetail from './pages/SystemControllerDetail';
import SystemController from './pages/SystemController';  
import Subclouds from './pages/Subclouds';
import Nodes from './pages/Nodes';
import NodeDetail from './pages/NodeDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/systemcontroller" replace />} />
          <Route path="systemcontroller" element={<SystemController />} />
          <Route path="systemcontroller/:id" element={<SystemControllerDetail />} />
          <Route path="subclouds" element={<Subclouds />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="nodes/:id" element={<NodeDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
