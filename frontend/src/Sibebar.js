import { Nav } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';

const Sidebar = ({ setSelectedEntityType, onLogout }) => {
  // elements = {
  //   "SystemController": ["Subclouds", "Nodes"],
  //   "Subclouds": ["nodes"]
  // }
  const categories = {
    SystemControllers: ["Overview","Systemcontrollers", "Images"],
    Subclouds: ["Overview","Subclouds"],
    Nodes: [] // No dropdown options
  };
  return (
    <div 
    className="d-flex flex-column p-3 bg-light shadow-sm"
    style={{
      width: "250px",
      height: "100vh",
      // marginTop: "50px",
      position: "fixed",
      left: 0,
      top: 0,
      overflowY: "auto"
    }}
  >
    <Accordion defaultActiveKey="0">
      {Object.entries(categories).map(([category,options], index) => (
        <Accordion.Item eventKey={index.toString()} key={category}>
          <Accordion.Header>{category}</Accordion.Header>
          <Accordion.Body>
            {options.map((option) => (
              <div 
                key={option}
                className="p-2 my-1 text-center fw-bold rounded shadow-sm"
                style={{ 
                  backgroundColor: "#f8f9fa", 
                  cursor: "pointer", 
                  border: "1px solid #ddd",
                  transition: "all 0.2s ease-in-out"
                }}
                onClick={() => setSelectedEntityType(category,option)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#d1e7fd"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
              >
                {option}
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
    <div className="position-absolute bottom-0  p-3">
    <button className="btn btn-danger btn-sm" onClick={onLogout}>Logout</button>
    </div>
  </div>
  );
};

export default Sidebar;
