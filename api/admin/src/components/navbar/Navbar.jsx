import "./navbar.scss";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import { useContext } from "react";
import axios from "axios";

const API_URL = "https://nestinn.onrender.com/api";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { dispatch: authDispatch } = useContext(AuthContext); // Get Auth Context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        // Send "admin" userType during logout
        await axios.post(
            `${API_URL}/auth/logout`,
            { userType: "admin" },  // Send user type to the backend
            { withCredentials: true }
        );

        // Remove ONLY authentication details, not the entire user object
        localStorage.removeItem("user");

        // Dispatch logout action
        authDispatch({ type: "LOGOUT" });

        alert("Logged out successfully!");
        navigate("/login");
    } catch (err) {
        console.error("Logout failed:", err);
    }
};

  

  return (
    <div className="navbar">
      <div className="wrapper">        
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="item">
            <img
              src="https://i.pinimg.com/736x/dc/6c/b0/dc6cb0521d182f959da46aaee82e742f.jpg"
              alt=""
              className="avatar"
            />
          </div>
          <div className="item" onClick={handleLogout} style={{ cursor: "pointer" }}>
            <LogoutIcon className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
