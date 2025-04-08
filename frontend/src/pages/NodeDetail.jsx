import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../services/api';
import { Button, Spinner } from 'react-bootstrap';


const ITEMS_PER_PAGE = 10;

function NodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [node, setNode] = useState(null);
  const [nodeBios, setNodeBios] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNodeDetails();
    fetchNodeBiosInfo();
  }, [id]);

  // const BiosTableWithPagination = ({nodeBios, activeTab}) => {

  //   const [currentPage, setCurrentPage] = useState(1);
  //   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  //   const endIndex = startIndex + ITEMS_PER_PAGE;
  //   const paginatedBios = nodeBios.slice(startIndex, endIndex);
  //   const totalPages = Math.ceil(nodeBios.length / ITEMS_PER_PAGE);
  //   const goToNextPage = () => {
  //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  //   };

  //   const goToPreviousPage = () => {
  //     if (currentPage > 1) setCurrentPage(currentPage - 1);
  //   };
  //   return (
  //     <>
  //       {activeTab === "bios" && (
  //         <div className="card">
  //           <div className="card-body">
  //           <input
  //             type="text"
  //             placeholder="Filter by attribute key..."
  //             // value={filterTerm}
  //             // onChange={(e) => setFilterTerm(e.target.value)}
  //             className="input input-bordered w-full max-w-xs"
  //           />
  //             <table className="table">
  //               <thead>
  //                 <tr>
  //                   <th>id</th>
  //                   <th>attribute</th>
  //                   <th>value</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {paginatedBios.map((item) => (
  //                   <tr key={item.id}>
  //                     <td>{item.id}</td>
  //                     <td>{item.setting_key}</td>
  //                     <td>{item.setting_value}</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  
  //             {/* Pagination Controls */}
  //             <div className="flex items-center justify-between w-full px-4 py-2">
  //               <button
  //                 onClick={goToPreviousPage}
  //                 disabled={currentPage === 1}
  //                 className={`px-4 py-2 rounded ${
  //                   currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
  //                 }`}
  //               >
  //                 &lt;
  //               </button>
  
  //               <span className="text-center flex-1 text-lg">
  //                 Page {currentPage} of {totalPages}
  //               </span>
  
  //               <button
  //                 onClick={goToNextPage}
  //                 disabled={currentPage === totalPages}
  //                 className={`px-4 py-2 rounded ${
  //                   currentPage === totalPages
  //                     // ? "bg-gray-300"
  //                     // : "bg-blue-500 text-white"
  //                 }`}
  //               >&gt;</button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </>
  //   );
  // };

  const BiosTableWithPagination = ({ nodeBios, activeTab }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterTerm, setFilterTerm] = useState("");
  
    // Filter bios attributes based on the key
    const filteredBios = nodeBios.filter((item) =>
      item.setting_key.toLowerCase().includes(filterTerm.toLowerCase())
    );
  
    const totalPages = Math.ceil(filteredBios.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedBios = filteredBios.slice(startIndex, endIndex);
  
    // Reset to page 1 if filter term changes
    useEffect(() => {
      setCurrentPage(1);
    }, [filterTerm]);
  
    const goToNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
  
    const goToPreviousPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
  
    return (
      <>
        {activeTab === "bios" && (
          <div className="card">
            <div className="card-body space-y-4">
              {/* 🔍 Filter Input */}
              <input
                type="text"
                placeholder="Filter by attribute key..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
  
              {/* 📋 Table */}
              <table className="table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>attribute</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBios.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.setting_key}</td>
                      <td>{item.setting_value}</td>
                      <td><Button className='btn-danger'>Change</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
  
              {/* 🔁 Pagination Controls */}
              <div className="flex items-center justify-between w-full px-4 py-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`text-2xl font-bold ${
                    currentPage === 1 ? "text-gray-400" : "text-blue-600"
                  }`}
                >
                  &lt;
                </button>
  
                <span className="text-center flex-1 text-lg">
                  Page {currentPage} of {totalPages || 1}
                </span>
  
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`text-2xl font-bold ${
                    currentPage === totalPages || totalPages === 0
                      ? "text-gray-400"
                      : "text-blue-600"
                  }`}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  
  const fetchNodeDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.get(`/nodes/${id}`);
      setNode(data);
    } catch (err) {
      setError('Failed to fetch node details');
      console.error('Error fetching node:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNodeBiosInfo = async () => {
    try {
      setIsLoading(true);
      const biosInfo = await api.get(`/nodes/${id}/bios`);
      console.log(biosInfo)
      setNodeBios(biosInfo);
    } catch (err) {
      setError('Failed to fetch node Bios Information');
      console.error('Error fetching node Bios Information:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "bios", label: "Bios" },
    { id: "configuration", label: "Configuration" },
    { id: "logs", label: "Logs" },
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

  if (!node) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Node not found
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate("/nodes")}
        >
          ← Back
        </button>
        <h2 className="mb-0">Node {node.name} Details</h2>
      </div>

      <ul className="nav nav-tabs mb-4">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Overview</h5>
              <div className="row">
                <div className="col-md-6">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>ID</th>
                        <td>{node.id}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{node.name}</td>
                      </tr>
                      <tr>
                        <th>Hostname</th>
                        <td>{node.host_name}</td>
                      </tr>
                      <tr>
                        <th>BM IP</th>
                        <td>{node.bm_ip}</td>
                      </tr>
                      <tr>
                        <th>Role</th>
                        <td>
                          <span className={`badge ${
                            node.role === "controller" ? "bg-primary" :
                            node.role === "worker" ? "bg-success" :
                            node.role === "storage" ? "bg-warning" :
                            "bg-info"
                          }`}>
                            {node.role}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className={`badge ${
                            node.status === "active" ? "bg-success" :
                            node.status === "provisioning" ? "bg-warning" :
                            node.status === "error" ? "bg-danger" :
                            "bg-secondary"
                          }`}>
                            {node.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Parent Type</th>
                        <td>{node.parent_type}</td>
                      </tr>
                      <tr>
                        <th>Parent ID</th>
                        <td>{node.parent_id}</td>
                      </tr>
                      <tr>
                        <th>Created At</th>
                        <td>{new Date(node.created_at).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <h6>Node Health</h6>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: '75%' }}>
                      CPU: 75%
                    </div>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar" role="progressbar" style={{ width: '60%' }}>
                      Memory: 60%
                    </div>
                  </div>
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: '40%' }}>
                      Storage: 40%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {activeTab === "bios" && (
          <div className="card">
            <div className="card-body">
              <table className='table'>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>attribute</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                  {nodeBios.map((item) => (
                    
                      <tr>
                        <td>{item.id}</td>
                        <td>{item.setting_key}</td>
                        <td>{item.setting_value}</td>
                      </tr>
                    
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}
        {activeTab === "bios" && (
          <BiosTableWithPagination nodeBios={nodeBios} activeTab ={activeTab} />
        )}

        {activeTab === "configuration" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Configuration</h5>
              <p>Configuration information will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Logs</h5>
              <p>Log information will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeDetail;
