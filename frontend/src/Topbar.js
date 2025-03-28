import { useNavigate } from "react-router-dom";

const Topbar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-primary text-white shadow-sm"
         style={{ width: "100vw", height: "50px", position: "fixed", top: 0, left: 0, zIndex: 1000 }}>
      <h5 className="m-0" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        Onboarding
      </h5>
      <button className="btn btn-danger btn-sm w-100" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Topbar;
